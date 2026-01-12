import React from 'react';
import { TerminalLog } from './components/TerminalLog';
import { AppCard } from './components/AppCard';
import { AppFolder, AppStatus, DiskInfo, MigrationConfig, MoveStep } from './types';

import { translate } from './translations';
import { scanDisks, scanApplications, sortApplications, filterApplications } from './services/diskService';
import { analyzeFolderSafety } from './services/geminiService';
import { migrationService } from './services/migrationService';
import { themeService, Theme } from './services/themeService';
import { defaultMigrationConfig } from './constants';

const App: React.FC = (): JSX.Element => {
  const [appFolders, setAppFolders] = React.useState<AppFolder[]>([]);
  const [disks, setDisks] = React.useState<DiskInfo[]>([]);
  const [selectedDisk, setSelectedDisk] = React.useState<string>('C:');
  const [targetDisk, setTargetDisk] = React.useState<string>('D:');
  const [activeLanguage, setActiveLanguage] = React.useState<'en' | 'zh'>('zh');
  const [theme, setTheme] = React.useState<Theme>(themeService.getTheme());
  const [isScanning, setIsScanning] = React.useState<boolean>(false);
  const [scanProgress, setScanProgress] = React.useState<number>(0);
  const [sortBy, setSortBy] = React.useState<'name' | 'size' | 'status' | 'path'>('name');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [isMigrating, setIsMigrating] = React.useState<boolean>(false);
  const [migrationProgress, setMigrationProgress] = React.useState<number>(0);
  const [migrationConfig, setMigrationConfig] = React.useState<MigrationConfig>(defaultMigrationConfig);
  const [selectedApps, setSelectedApps] = React.useState<string[]>([]);
  const [showMigrationModal, setShowMigrationModal] = React.useState<boolean>(false);

  // 订阅主题变化
  React.useEffect(() => {
    const unsubscribe = themeService.subscribe((newTheme) => {
      setTheme(newTheme);
    });

    return unsubscribe;
  }, []);

  // 初始化时扫描磁盘
  React.useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const disksList = await scanDisks();
        setDisks(disksList);
        if (disksList.length > 0 && disksList[0]) {
          setSelectedDisk(disksList[0].path);
        }
      } catch (error) {
        console.error('初始化失败:', error);
      }
    };

    initialize();
  }, []);

  // 当选择的磁盘改变时，扫描应用程序
  React.useEffect(() => {
    const loadApplications = async (): Promise<void> => {
      if (selectedDisk) {
        setIsScanning(true);
        setScanProgress(0);
        try {
          const apps = await scanApplications(selectedDisk, (progress) => {
            setScanProgress(progress);
          });
          setAppFolders(apps);
        } catch (error) {
          console.error('扫描应用程序失败:', error);
        } finally {
          setIsScanning(false);
        }
      }
    };

    loadApplications();
  }, [selectedDisk]);

  const handleAnalyzeSafety = async (id: string): Promise<void> => {
    const app = appFolders.find((a: AppFolder) => a.id === id);
    if (!app) return;

    // 更新应用状态为分析中
    setAppFolders((prev: AppFolder[]) => prev.map((a: AppFolder) => 
      a.id === id ? { ...a, status: AppStatus.ANALYZING } : a
    ));


    try {
      // 调用 AI 分析服务
      const analysis = await analyzeFolderSafety(app.sourcePath, app.name);
      
      // 计算安全评分（0-100）
      let safetyScore = 70; // 默认评分
      if (analysis.riskLevel === 'low') {
        safetyScore = 90;
      } else if (analysis.riskLevel === 'medium') {
        safetyScore = 60;
      } else if (analysis.riskLevel === 'high') {
        safetyScore = 30;
      }

      // 更新应用状态和分析结果
      setAppFolders(prev => prev.map(a => 
        a.id === id ? {
          ...a,
          status: AppStatus.READY,
          safetyScore,
          aiAnalysis: analysis.recommendations.join('\n')
        } : a
      ));
    } catch (error) {
      console.error('AI 分析失败:', error);
      // 更新应用状态为错误
      setAppFolders(prev => prev.map(a => 
        a.id === id ? { ...a, status: AppStatus.ERROR } : a
      ));
    }
  };

  const handleMoveApp = (id: string): void => {
    // 选择单个应用并打开迁移模态框
    setSelectedApps([id]);
    setShowMigrationModal(true);
  };

  const handleAppSelection = (id: string): void => {
    setSelectedApps((prev: string[]) => 
      prev.includes(id) 
        ? prev.filter((appId: string) => appId !== id)
        : [...prev, id]
    );
  };

  const handleMigrationConfigChange = (key: keyof MigrationConfig, value: boolean): void => {
    setMigrationConfig((prev: MigrationConfig) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStartMigration = async (): Promise<void> => {
    if (selectedApps.length === 0) return;

    setIsMigrating(true);
    setShowMigrationModal(false);

    const appsToMigrate = appFolders.filter(app => selectedApps.includes(app.id));
    const targetPath = `${targetDisk}\WinLinkMigrator`;

    try {
      const results = await migrationService.migrateMultipleApps(
        appsToMigrate,
        targetPath,
        migrationConfig,
        (appId: string, progress: { step: MoveStep; progress: number }) => {
          // 更新应用状态和进度
          setAppFolders((prev: AppFolder[]) => prev.map((app: AppFolder) => 
            app.id === appId 
              ? {
                  ...app,
                  status: AppStatus.MOVING,
                  moveStep: progress.step,
                  progress: progress.progress
                }
              : app
          ));

          // 计算整体迁移进度
          const totalSteps = appsToMigrate.length * 3; // 假设每个应用有3个步骤
          const completedSteps = appsToMigrate.reduce((acc: number, app: AppFolder) => {
            const appProgress = appFolders.find((a: AppFolder) => a.id === app.id);
            return acc + (appProgress?.progress || 0) / 100;
          }, 0);
          const overallProgress = Math.round((completedSteps / totalSteps) * 100);
          setMigrationProgress(overallProgress);
        }
      );

      // 更新所有应用的最终状态
      setAppFolders((prev: AppFolder[]) => prev.map((app: AppFolder) => {
        const result = results.find((r: { app: AppFolder }) => r.app.id === app.id);
        return result ? result.app : app;
      }));

    } catch (error) {
      console.error('迁移失败:', error);
    } finally {
      setIsMigrating(false);
      setMigrationProgress(0);
      setSelectedApps([]);
    }
  };

  const handleCancelMigration = (appId: string): void => {
    migrationService.cancelMigration(appId);
    // 更新应用状态
    setAppFolders((prev: AppFolder[]) => prev.map((app: AppFolder) => 
      app.id === appId ? { ...app, status: AppStatus.READY } : app
    ));
  };

  const handleRollbackMigration = async (appId: string): Promise<void> => {
    const app = appFolders.find((a: AppFolder) => a.id === appId);
    if (!app) return;

    try {
      const result = await migrationService.rollbackMigration(app, (progress: { step: MoveStep; progress: number }) => {
        // 更新应用状态和进度
        setAppFolders((prev: AppFolder[]) => prev.map((a: AppFolder) => 
          a.id === appId 
            ? {
                ...a,
                status: AppStatus.MOVING,
                moveStep: progress.step,
                progress: progress.progress
              }
            : a
        ));
      });

      // 更新应用最终状态
      setAppFolders((prev: AppFolder[]) => prev.map((a: AppFolder) => 
        a.id === appId ? result.app : a
      ));

    } catch (error) {
      console.error('回滚失败:', error);
    }
  };

  const handleThemeChange = (newTheme: Theme): void => {
    themeService.setTheme(newTheme);
  };

  // 处理排序
  const handleSort = (newSortBy: 'name' | 'size' | 'status' | 'path'): void => {
    if (newSortBy === sortBy) {
      // 如果点击相同的排序字段，切换排序顺序
      setSortOrder((prev: 'asc' | 'desc') => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // 否则，设置新的排序字段并默认使用升序
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };


  // 应用排序和过滤
  const filteredAndSortedApps = React.useMemo(() => {
    let result = [...appFolders];

    // 应用搜索过滤
    if (searchTerm) {
      result = filterApplications(result, { searchTerm });
    }

    // 应用排序
    result = sortApplications(result, sortBy, sortOrder);

    return result;
  }, [appFolders, sortBy, sortOrder, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 标题栏 */}
      <div className="window-titlebar">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">WinLink Migrator</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className={`px-2 py-1 rounded text-sm ${activeLanguage === 'zh' ? 'bg-primary-600' : 'dark:bg-slate-700 bg-slate-200 dark:text-white text-slate-900'}`}
              onClick={() => setActiveLanguage('zh')}
              title="中文"
            >
              中
            </button>
            <button
              className={`px-2 py-1 rounded text-sm ${activeLanguage === 'en' ? 'bg-primary-600' : 'dark:bg-slate-700 bg-slate-200 dark:text-white text-slate-900'}`}
              onClick={() => setActiveLanguage('en')}
              title="English"
            >
              En
            </button>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-primary-600' : 'dark:bg-slate-700 bg-slate-200 dark:text-white text-slate-900'}`}
              onClick={() => handleThemeChange('dark')}
              title="深色模式"
            >
              🌙
            </button>
            <button
              className={`px-2 py-1 rounded ${theme === 'light' ? 'bg-primary-600' : 'dark:bg-slate-700 bg-slate-200 dark:text-white text-slate-900'}`}
              onClick={() => handleThemeChange('light')}
              title="浅色模式"
            >
              ☀️
            </button>
            <button
              className={`px-2 py-1 rounded ${theme === 'system' ? 'bg-primary-600' : 'dark:bg-slate-700 bg-slate-200 dark:text-white text-slate-900'}`}
              onClick={() => handleThemeChange('system')}
              title="系统主题"
            >
              📱
            </button>
          </div>
          
          <div className="window-controls">
            <button className="window-control window-control-minimize" title="最小化">_</button>
            <button className="window-control window-control-maximize" title="最大化">□</button>
            <button className="window-control window-control-close" title="关闭">×</button>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
        {/* 磁盘选择 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">{translate('winlinkMigrator', activeLanguage)}</h2>
          
          <div className="dark:bg-slate-800 bg-white dark:border dark:border-slate-700 border border-slate-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white text-slate-900">{translate('systemDrive', activeLanguage)}</label>
                <select
                  className="dark:bg-slate-700 dark:border dark:border-slate-600 bg-white border border-slate-300 dark:text-white text-slate-900 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
                  value={selectedDisk}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDisk(e.target.value)}
                  disabled={isScanning}
                >
                  {disks.map((disk: { id: string; name: string; path: string; freeSpace: string }) => (
                    <option key={disk.id} value={disk.path}>
                      {disk.name} ({disk.path}) - {disk.freeSpace} 可用
                    </option>
                  ))}

                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white text-slate-900">{translate('targetDrive', activeLanguage)}</label>
                <select
                  className="dark:bg-slate-700 dark:border dark:border-slate-600 bg-white border border-slate-300 dark:text-white text-slate-900 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
                  value={targetDisk}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTargetDisk(e.target.value)}
                  disabled={isMigrating}
                >
                  {disks.filter((disk: { path: string }) => disk.path !== selectedDisk).map((disk: { id: string; name: string; path: string; freeSpace: string }) => (
                    <option key={disk.id} value={disk.path}>
                      {disk.name} ({disk.path}) - {disk.freeSpace} 可用
                    </option>
                  ))}

                </select>
              </div>
            </div>
            
            {isScanning && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm dark:text-white text-slate-900">{translate('scanning', activeLanguage)}...</span>
                  <span className="text-sm font-mono dark:text-white text-slate-900">{scanProgress}%</span>
                </div>
                <div className="w-full dark:bg-slate-700 bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {isMigrating && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm dark:text-white text-slate-900">{translate('migrationInProgress', activeLanguage)}...</span>
                  <span className="text-sm font-mono dark:text-white text-slate-900">{migrationProgress}%</span>
                </div>
                <div className="w-full dark:bg-slate-700 bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${migrationProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* 搜索、排序和批量操作 */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder={`${translate('search', activeLanguage)}...`}
                className="w-full dark:bg-slate-800 dark:border dark:border-slate-700 bg-white border border-slate-300 dark:text-white text-slate-900 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm dark:text-white text-slate-900 whitespace-nowrap">{translate('sortBy', activeLanguage)}:</span>
                <select
                  className="flex-1 dark:bg-slate-800 dark:border dark:border-slate-700 bg-white border border-slate-300 dark:text-white text-slate-900 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value as 'name' | 'size' | 'status' | 'path')}
                >
                  <option value="name">{translate('name', activeLanguage)}</option>
                  <option value="size">{translate('size', activeLanguage)}</option>
                  <option value="status">{translate('status', activeLanguage)}</option>
                  <option value="path">{translate('path', activeLanguage)}</option>
                </select>
                <button
                  className="dark:bg-slate-800 dark:border dark:border-slate-700 bg-white border border-slate-300 dark:text-white text-slate-900 rounded px-2 py-1 whitespace-nowrap"
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  title={sortOrder === 'asc' ? '切换为降序' : '切换为升序'}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
              
              {selectedApps.length > 0 && (
                <button
                  className="btn btn-primary whitespace-nowrap"
                  onClick={() => setShowMigrationModal(true)}
                  disabled={isMigrating}
                >
                  {translate('migrate', activeLanguage)} ({selectedApps.length})
                </button>
              )}
            </div>
          </div>

          {/* 应用程序列表 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">{translate('apps', activeLanguage)} ({filteredAndSortedApps.length})</h3>
            {isScanning ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <p>{translate('scanning', activeLanguage)}...</p>
                </div>
              </div>
            ) : filteredAndSortedApps.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-8 text-center">
                <p>{translate('noAppsFound', activeLanguage)}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAndSortedApps.map((app) => (
                  <div key={app.id} className="relative">
                    <div 
                      className="absolute top-2 left-2 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAppSelection(app.id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedApps.includes(app.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleAppSelection(app.id);
                        }}
                        className="w-4 h-4 rounded border-slate-600 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                    <AppCard
                      app={app}
                      onAnalyzeSafety={handleAnalyzeSafety}
                      onMove={handleMoveApp}
                      language={activeLanguage}
                    />
                    {app.status === AppStatus.MOVED && (
                      <button
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 text-xs"
                        onClick={() => handleRollbackMigration(app.id)}
                      >
                        {translate('back', activeLanguage)}
                      </button>
                    )}
                    {app.status === AppStatus.MOVING && (
                      <button
                        className="absolute top-2 right-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded px-2 py-1 text-xs"
                        onClick={() => handleCancelMigration(app.id)}
                      >
                        {translate('cancel', activeLanguage)}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 终端日志 */}
      <TerminalLog language={activeLanguage} />

      {/* 迁移配置模态框 */}
      {showMigrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="dark:bg-slate-900 dark:border dark:border-slate-700 bg-white border border-slate-200 rounded-lg p-6 max-w-md w-full sm:max-w-lg dark:text-white text-slate-900">
            <h3 className="text-xl font-semibold mb-4">{translate('migrationSettings', activeLanguage)}</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-sm font-medium mb-2">{translate('selectedApps', activeLanguage)} ({selectedApps.length})</h4>
                <div className="bg-slate-800 rounded p-3 max-h-40 overflow-y-auto scrollbar-thin">
                  {appFolders
                    .filter(app => selectedApps.includes(app.id))
                    .map(app => (
                      <div key={app.id} className="text-sm mb-1 flex justify-between items-center">
                        <span>{app.name}</span>
                        <span className="text-slate-400">{app.size}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">{translate('targetDrive', activeLanguage)}</h4>
                <select
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={targetDisk}
                  onChange={(e) => setTargetDisk(e.target.value)}
                >
                  {disks.filter(disk => disk.path !== selectedDisk).map((disk) => (
                    <option key={disk.id} value={disk.path}>
                      {disk.name} ({disk.path}) - {disk.freeSpace} 可用
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">{translate('migrationSettings', activeLanguage)}</h4>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm">{translate('overwriteExisting', activeLanguage)}</label>
                  <input
                    type="checkbox"
                    checked={migrationConfig.overwriteExisting}
                    onChange={(e) => handleMigrationConfigChange('overwriteExisting', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm">{translate('createBackup', activeLanguage)}</label>
                  <input
                    type="checkbox"
                    checked={migrationConfig.createBackup}
                    onChange={(e) => handleMigrationConfigChange('createBackup', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm">{translate('verifyAfterMove', activeLanguage)}</label>
                  <input
                    type="checkbox"
                    checked={migrationConfig.verifyAfterMove}
                    onChange={(e) => handleMigrationConfigChange('verifyAfterMove', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm">{translate('parallelExecution', activeLanguage)}</label>
                  <input
                    type="checkbox"
                    checked={migrationConfig.parallelExecution}
                    onChange={(e) => handleMigrationConfigChange('parallelExecution', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 text-primary-600 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                className="btn btn-secondary"
                onClick={() => setShowMigrationModal(false)}
              >
                {translate('cancel', activeLanguage)}
              </button>
              <button
                className="btn btn-primary"
                onClick={handleStartMigration}
              >
                {translate('startMigration', activeLanguage)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;