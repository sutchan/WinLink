// src/App.tsx v3.1.16
import React from 'react';
import { TerminalLog } from './components/TerminalLog';
import { TitleBar, DiskSelector, Toolbar, AppGrid, MigrationModal } from './components/parts';
import { AppFolder, AppStatus, DiskInfo, MigrationConfig, MoveStep } from './types';
import { scanDisks, scanApplications, sortApplications, filterApplications } from './services/diskService';
import { analyzeFolderSafety } from './services/geminiService';
import { migrationService } from './services/migrationService';
import { themeService, Theme } from './services/themeService';
import { logService } from './services/logService';
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
    return themeService.subscribe(setTheme);
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
        logService.addLog(`初始化失败: ${String(error)}`, 'error');
      }
    };
    initialize();
  }, []);

  // 当选择的磁盘改变时，扫描应用程序
  React.useEffect(() => {
    const loadApplications = async (): Promise<void> => {
      if (!selectedDisk) return;
      setIsScanning(true);
      setScanProgress(0);
      try {
        const apps = await scanApplications(selectedDisk, setScanProgress);
        setAppFolders(apps);
      } catch (error) {
        logService.addLog(`扫描应用程序失败: ${String(error)}`, 'error');
      } finally {
        setIsScanning(false);
      }
    };
    loadApplications();
  }, [selectedDisk]);

  const handleAnalyzeSafety = async (id: string): Promise<void> => {
    const app = appFolders.find((a: AppFolder) => a.id === id);
    if (!app) return;

    setAppFolders((prev: AppFolder[]) =>
      prev.map((a: AppFolder) => (a.id === id ? { ...a, status: AppStatus.ANALYZING } : a))
    );

    try {
      const analysis = await analyzeFolderSafety(app.sourcePath, app.name);

      // 根据风险等级计算安全评分（0-100）
      const safetyScore =
        analysis.riskLevel === 'low' ? 90 :
        analysis.riskLevel === 'medium' ? 60 :
        analysis.riskLevel === 'high' ? 30 : 70;

      setAppFolders((prev: AppFolder[]) =>
        prev.map((a: AppFolder) =>
          a.id === id
            ? { ...a, status: AppStatus.READY, safetyScore, aiAnalysis: analysis.recommendations.join('\n') }
            : a
        )
      );
    } catch (error) {
      logService.addLog(`AI 分析失败: ${String(error)}`, 'error');
      setAppFolders((prev: AppFolder[]) =>
        prev.map((a: AppFolder) => (a.id === id ? { ...a, status: AppStatus.ERROR } : a))
      );
    }
  };

  const handleMoveApp = (id: string): void => {
    setSelectedApps([id]);
    setShowMigrationModal(true);
  };

  const handleAppSelection = (id: string): void => {
    setSelectedApps((prev: string[]) =>
      prev.includes(id) ? prev.filter((appId: string) => appId !== id) : [...prev, id]
    );
  };

  const handleMigrationConfigChange = (key: keyof MigrationConfig, value: boolean): void => {
    setMigrationConfig((prev: MigrationConfig) => ({ ...prev, [key]: value }));
  };

  const handleStartMigration = async (): Promise<void> => {
    if (selectedApps.length === 0) return;

    setIsMigrating(true);
    setShowMigrationModal(false);

    const appsToMigrate = appFolders.filter((app: AppFolder) => selectedApps.includes(app.id));
    const targetPath = `${targetDisk}\\WinLinkMigrator`;

    try {
      const results = await migrationService.migrateMultipleApps(
        appsToMigrate,
        targetPath,
        migrationConfig,
        (appId: string, progress: { step: MoveStep; progress: number }) => {
          setAppFolders((prev: AppFolder[]) =>
            prev.map((app: AppFolder) =>
              app.id === appId
                ? { ...app, status: AppStatus.MOVING, moveStep: progress.step, progress: progress.progress }
                : app
            )
          );

          // 计算整体迁移进度（假设每个应用有 3 个步骤）
          const totalSteps = appsToMigrate.length * 3;
          const completedSteps = appsToMigrate.reduce((acc: number, app: AppFolder) => {
            const appProgress = appFolders.find((a: AppFolder) => a.id === app.id);
            return acc + (appProgress?.progress || 0) / 100;
          }, 0);
          setMigrationProgress(Math.round((completedSteps / totalSteps) * 100));
        }
      );

      setAppFolders((prev: AppFolder[]) =>
        prev.map((app: AppFolder) => {
          const result = results.find((r: { app: AppFolder }) => r.app.id === app.id);
          return result ? result.app : app;
        })
      );
    } catch (error) {
      logService.addLog(`迁移失败: ${String(error)}`, 'error');
    } finally {
      setIsMigrating(false);
      setMigrationProgress(0);
      setSelectedApps([]);
    }
  };

  const handleCancelMigration = (appId: string): void => {
    migrationService.cancelMigration(appId);
    setAppFolders((prev: AppFolder[]) =>
      prev.map((app: AppFolder) => (app.id === appId ? { ...app, status: AppStatus.READY } : app))
    );
  };

  const handleRollbackMigration = async (appId: string): Promise<void> => {
    const app = appFolders.find((a: AppFolder) => a.id === appId);
    if (!app) return;

    try {
      const result = await migrationService.rollbackMigration(app, (progress: { step: MoveStep; progress: number }) => {
        setAppFolders((prev: AppFolder[]) =>
          prev.map((a: AppFolder) =>
            a.id === appId
              ? { ...a, status: AppStatus.MOVING, moveStep: progress.step, progress: progress.progress }
              : a
          )
        );
      });

      setAppFolders((prev: AppFolder[]) =>
        prev.map((a: AppFolder) => (a.id === appId ? result.app : a))
      );
    } catch (error) {
      logService.addLog(`回滚失败: ${String(error)}`, 'error');
    }
  };

  const handleThemeChange = (newTheme: Theme): void => {
    themeService.setTheme(newTheme);
  };

  const handleSort = (newSortBy: 'name' | 'size' | 'status' | 'path'): void => {
    if (newSortBy === sortBy) {
      setSortOrder((prev: 'asc' | 'desc') => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const handleToggleSortOrder = (): void => {
    setSortOrder((prev: 'asc' | 'desc') => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // 应用排序和过滤
  const filteredAndSortedApps = React.useMemo(() => {
    let result = [...appFolders];
    if (searchTerm) {
      result = filterApplications(result, { searchTerm });
    }
    return sortApplications(result, sortBy, sortOrder);
  }, [appFolders, sortBy, sortOrder, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      <TitleBar
        theme={theme}
        activeLanguage={activeLanguage}
        onLanguageChange={setActiveLanguage}
        onThemeChange={handleThemeChange}
      />

      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
        <div className="mb-6">
          <DiskSelector
            disks={disks}
            selectedDisk={selectedDisk}
            targetDisk={targetDisk}
            isScanning={isScanning}
            isMigrating={isMigrating}
            scanProgress={scanProgress}
            migrationProgress={migrationProgress}
            activeLanguage={activeLanguage}
            onSelectedDiskChange={setSelectedDisk}
            onTargetDiskChange={setTargetDisk}
          />

          <Toolbar
            searchTerm={searchTerm}
            sortBy={sortBy}
            sortOrder={sortOrder}
            selectedApps={selectedApps}
            isMigrating={isMigrating}
            activeLanguage={activeLanguage}
            onSearchChange={setSearchTerm}
            onSortChange={handleSort}
            onToggleSortOrder={handleToggleSortOrder}
            onOpenMigrationModal={() => setShowMigrationModal(true)}
          />

          <AppGrid
            apps={filteredAndSortedApps}
            selectedApps={selectedApps}
            activeLanguage={activeLanguage}
            isScanning={isScanning}
            onAnalyzeSafety={handleAnalyzeSafety}
            onMove={handleMoveApp}
            onToggleSelect={handleAppSelection}
            onRollback={handleRollbackMigration}
            onCancelMigration={handleCancelMigration}
          />
        </div>
      </div>

      <TerminalLog language={activeLanguage} />

      {showMigrationModal && (
        <MigrationModal
          disks={disks}
          appFolders={appFolders}
          selectedApps={selectedApps}
          targetDisk={targetDisk}
          selectedDisk={selectedDisk}
          migrationConfig={migrationConfig}
          activeLanguage={activeLanguage}
          onTargetDiskChange={setTargetDisk}
          onConfigChange={handleMigrationConfigChange}
          onClose={() => setShowMigrationModal(false)}
          onStartMigration={handleStartMigration}
        />
      )}
    </div>
  );
};

export default App;
