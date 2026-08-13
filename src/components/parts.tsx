// src/components/parts.tsx v3.1.16
import React from 'react';
import { AppCard } from './AppCard';
import { AppFolder, AppStatus, DiskInfo, MigrationConfig } from '../types';
import { Theme } from '../services/themeService';
import { translate } from '../translations';

interface TitleBarProps {
  theme: Theme;
  activeLanguage: 'en' | 'zh';
  onLanguageChange: (lang: 'en' | 'zh') => void;
  onThemeChange: (theme: Theme) => void;
}

// 标题栏：应用名、语言切换、主题切换、窗口控件
export const TitleBar: React.FC<TitleBarProps> = ({
  theme,
  activeLanguage,
  onLanguageChange,
  onThemeChange
}) => (
  <div className="window-titlebar">
    <div className="flex items-center gap-2">
      <h1 className="text-lg font-semibold">WinLink</h1>
    </div>
    <div className="flex items-center gap-2 sm:gap-4">
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          className={`px-2 py-1 rounded text-sm ${activeLanguage === 'zh' ? 'bg-primary-600' : 'dark:bg-slate-700 bg-slate-200 dark:text-white text-slate-900'}`}
          onClick={() => onLanguageChange('zh')}
          title="中文"
        >
          中
        </button>
        <button
          className={`px-2 py-1 rounded text-sm ${activeLanguage === 'en' ? 'bg-primary-600' : 'dark:bg-slate-700 bg-slate-200 dark:text-white text-slate-900'}`}
          onClick={() => onLanguageChange('en')}
          title="English"
        >
          En
        </button>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-primary-600' : 'dark:bg-slate-700 bg-slate-200 dark:text-white text-slate-900'}`}
          onClick={() => onThemeChange('dark')}
          title="深色模式"
        >
          🌙
        </button>
        <button
          className={`px-2 py-1 rounded ${theme === 'light' ? 'bg-primary-600' : 'dark:bg-slate-700 bg-slate-200 dark:text-white text-slate-900'}`}
          onClick={() => onThemeChange('light')}
          title="浅色模式"
        >
          ☀️
        </button>
        <button
          className={`px-2 py-1 rounded ${theme === 'system' ? 'bg-primary-600' : 'dark:bg-slate-700 bg-slate-200 dark:text-white text-slate-900'}`}
          onClick={() => onThemeChange('system')}
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
);

interface DiskSelectorProps {
  disks: DiskInfo[];
  selectedDisk: string;
  targetDisk: string;
  isScanning: boolean;
  isMigrating: boolean;
  scanProgress: number;
  migrationProgress: number;
  activeLanguage: 'en' | 'zh';
  onSelectedDiskChange: (value: string) => void;
  onTargetDiskChange: (value: string) => void;
}

// 磁盘选择区 + 扫描/迁移进度
export const DiskSelector: React.FC<DiskSelectorProps> = ({
  disks,
  selectedDisk,
  targetDisk,
  isScanning,
  isMigrating,
  scanProgress,
  migrationProgress,
  activeLanguage,
  onSelectedDiskChange,
  onTargetDiskChange
}) => (
  <div className="dark:bg-slate-800 bg-white dark:border dark:border-slate-700 border border-slate-200 rounded-lg p-4 mb-6">
    <h2 className="text-2xl font-bold mb-4">{translate('winlinkMigrator', activeLanguage)}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2 dark:text-white text-slate-900">{translate('systemDrive', activeLanguage)}</label>
        <select
          className="dark:bg-slate-700 dark:border dark:border-slate-600 bg-white border border-slate-300 dark:text-white text-slate-900 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
          value={selectedDisk}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSelectedDiskChange(e.target.value)}
          disabled={isScanning}
        >
          {disks.map((disk) => (
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
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onTargetDiskChange(e.target.value)}
          disabled={isMigrating}
        >
          {disks.filter((disk) => disk.path !== selectedDisk).map((disk) => (
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
);

interface ToolbarProps {
  searchTerm: string;
  sortBy: 'name' | 'size' | 'status' | 'path';
  sortOrder: 'asc' | 'desc';
  selectedApps: string[];
  isMigrating: boolean;
  activeLanguage: 'en' | 'zh';
  onSearchChange: (value: string) => void;
  onSortChange: (value: 'name' | 'size' | 'status' | 'path') => void;
  onToggleSortOrder: () => void;
  onOpenMigrationModal: () => void;
}

// 搜索、排序与批量操作栏
export const Toolbar: React.FC<ToolbarProps> = ({
  searchTerm,
  sortBy,
  sortOrder,
  selectedApps,
  isMigrating,
  activeLanguage,
  onSearchChange,
  onSortChange,
  onToggleSortOrder,
  onOpenMigrationModal
}) => (
  <div className="flex flex-col gap-3 mb-6">
    <div className="flex-1">
      <input
        type="text"
        placeholder={`${translate('search', activeLanguage)}...`}
        className="w-full dark:bg-slate-800 dark:border dark:border-slate-700 bg-white border border-slate-300 dark:text-white text-slate-900 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>

    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm dark:text-white text-slate-900 whitespace-nowrap">{translate('sortBy', activeLanguage)}:</span>
        <select
          className="flex-1 dark:bg-slate-800 dark:border dark:border-slate-700 bg-white border border-slate-300 dark:text-white text-slate-900 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'name' | 'size' | 'status' | 'path')}
        >
          <option value="name">{translate('name', activeLanguage)}</option>
          <option value="size">{translate('size', activeLanguage)}</option>
          <option value="status">{translate('status', activeLanguage)}</option>
          <option value="path">{translate('path', activeLanguage)}</option>
        </select>
        <button
          className="dark:bg-slate-800 dark:border dark:border-slate-700 bg-white border border-slate-300 dark:text-white text-slate-900 rounded px-2 py-1 whitespace-nowrap"
          onClick={onToggleSortOrder}
          title={sortOrder === 'asc' ? '切换为降序' : '切换为升序'}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {selectedApps.length > 0 && (
        <button
          className="btn btn-primary whitespace-nowrap"
          onClick={onOpenMigrationModal}
          disabled={isMigrating}
        >
          {translate('migrate', activeLanguage)} ({selectedApps.length})
        </button>
      )}
    </div>
  </div>
);

interface AppGridProps {
  apps: AppFolder[];
  selectedApps: string[];
  activeLanguage: 'en' | 'zh';
  isScanning: boolean;
  onAnalyzeSafety: (id: string) => void;
  onMove: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onRollback: (id: string) => void;
  onCancelMigration: (id: string) => void;
}

// 应用卡片网格列表
export const AppGrid: React.FC<AppGridProps> = ({
  apps,
  selectedApps,
  activeLanguage,
  isScanning,
  onAnalyzeSafety,
  onMove,
  onToggleSelect,
  onRollback,
  onCancelMigration
}) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-4">{translate('apps', activeLanguage)} ({apps.length})</h3>
    {isScanning ? (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>{translate('scanning', activeLanguage)}...</p>
        </div>
      </div>
    ) : apps.length === 0 ? (
      <div className="bg-slate-800 rounded-lg p-8 text-center">
        <p>{translate('noAppsFound', activeLanguage)}</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {apps.map((app) => (
          <div key={app.id} className="relative">
            <div
              className="absolute top-2 left-2 z-10"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect(app.id);
              }}
            >
              <input
                type="checkbox"
                checked={selectedApps.includes(app.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleSelect(app.id);
                }}
                className="w-4 h-4 rounded border-slate-600 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <AppCard
              app={app}
              onAnalyzeSafety={onAnalyzeSafety}
              onMove={onMove}
              language={activeLanguage}
            />
            {app.status === AppStatus.MOVED && (
              <button
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 text-xs"
                onClick={() => onRollback(app.id)}
              >
                {translate('back', activeLanguage)}
              </button>
            )}
            {app.status === AppStatus.MOVING && (
              <button
                className="absolute top-2 right-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded px-2 py-1 text-xs"
                onClick={() => onCancelMigration(app.id)}
              >
                {translate('cancel', activeLanguage)}
              </button>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

interface MigrationModalProps {
  disks: DiskInfo[];
  appFolders: AppFolder[];
  selectedApps: string[];
  targetDisk: string;
  selectedDisk: string;
  migrationConfig: MigrationConfig;
  activeLanguage: 'en' | 'zh';
  onTargetDiskChange: (value: string) => void;
  onConfigChange: (key: keyof MigrationConfig, value: boolean) => void;
  onClose: () => void;
  onStartMigration: () => void;
}

// 迁移配置模态框
export const MigrationModal: React.FC<MigrationModalProps> = ({
  disks,
  appFolders,
  selectedApps,
  targetDisk,
  selectedDisk,
  migrationConfig,
  activeLanguage,
  onTargetDiskChange,
  onConfigChange,
  onClose,
  onStartMigration
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="dark:bg-slate-900 dark:border dark:border-slate-700 bg-white border border-slate-200 rounded-lg p-6 max-w-md w-full sm:max-w-lg dark:text-white text-slate-900">
      <h3 className="text-xl font-semibold mb-4">{translate('migrationSettings', activeLanguage)}</h3>

      <div className="space-y-4 mb-6">
        <div>
          <h4 className="text-sm font-medium mb-2">{translate('selectedApps', activeLanguage)} ({selectedApps.length})</h4>
          <div className="bg-slate-800 rounded p-3 max-h-40 overflow-y-auto scrollbar-thin">
            {appFolders
              .filter((app) => selectedApps.includes(app.id))
              .map((app) => (
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
            onChange={(e) => onTargetDiskChange(e.target.value)}
          >
            {disks.filter((disk) => disk.path !== selectedDisk).map((disk) => (
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
              onChange={(e) => onConfigChange('overwriteExisting', e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm">{translate('createBackup', activeLanguage)}</label>
            <input
              type="checkbox"
              checked={migrationConfig.createBackup}
              onChange={(e) => onConfigChange('createBackup', e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm">{translate('verifyAfterMove', activeLanguage)}</label>
            <input
              type="checkbox"
              checked={migrationConfig.verifyAfterMove}
              onChange={(e) => onConfigChange('verifyAfterMove', e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm">{translate('parallelExecution', activeLanguage)}</label>
            <input
              type="checkbox"
              checked={migrationConfig.parallelExecution}
              onChange={(e) => onConfigChange('parallelExecution', e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 text-primary-600 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          className="btn btn-secondary"
          onClick={onClose}
        >
          {translate('cancel', activeLanguage)}
        </button>
        <button
          className="btn btn-primary"
          onClick={onStartMigration}
        >
          {translate('startMigration', activeLanguage)}
        </button>
      </div>
    </div>
  </div>
);
