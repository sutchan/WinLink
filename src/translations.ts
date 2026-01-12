interface TranslationKeys {
  apps: string;
  analyzeSafety: string;
  move: string;
  status: string;
  size: string;
  path: string;
  ready: string;
  analyzing: string;
  moving: string;
  moved: string;
  error: string;
  paused: string;
  verifying: string;
  idle: string;
  mkdir: string;
  robocopy: string;
  mklink: string;
  completed: string;
  cleaning: string;
  safetyScore: string;
  aiAnalysis: string;
  progress: string;
  terminal: string;
  language: string;
  chinese: string;
  english: string;
  winlinkMigrator: string;
  systemDrive: string;
  targetDrive: string;
  selectDrive: string;
  migrate: string;
  cancel: string;
  confirm: string;
  back: string;
  next: string;
  finish: string;
  success: string;
  warning: string;
  info: string;
  danger: string;
  folder: string;
  file: string;
  files: string;
  folders: string;
  totalSize: string;
  freeSpace: string;
  usedSpace: string;
  scan: string;
  scanning: string;
  scanComplete: string;
  noAppsFound: string;
  noDisksFound: string;
  noLogsFound: string;
  migrateTo: string;
  selectApps: string;
  selectedApps: string;
  migrationSettings: string;
  overwriteExisting: string;
  createBackup: string;
  verifyAfterMove: string;
  parallelExecution: string;
  migrationSummary: string;
  startMigration: string;
  migrationInProgress: string;
  migrationComplete: string;
  migrationFailed: string;
  viewLogs: string;
  close: string;
  minimize: string;
  maximize: string;
  filter?: string;
  clear?: string;
  export?: string;
  search?: string;
  filterByType?: string;
  sortBy?: string;
  name?: string;
}

const translations: Record<'en' | 'zh', TranslationKeys> = {
  en: {
    apps: 'Applications',
    analyzeSafety: 'Analyze Safety',
    move: 'Move',
    status: 'Status',
    size: 'Size',
    path: 'Path',
    ready: 'Ready',
    analyzing: 'Analyzing',
    moving: 'Moving',
    moved: 'Moved',
    error: 'Error',
    paused: 'Paused',
    verifying: 'Verifying',
    idle: 'Idle',
    mkdir: 'Creating Directory',
    robocopy: 'Copying Files',
    mklink: 'Creating Junction',
    completed: 'Completed',
    cleaning: 'Cleaning',
    safetyScore: 'Safety Score',
    aiAnalysis: 'AI Analysis',
    progress: 'Progress',
    terminal: 'Terminal',
    language: 'Language',
    chinese: 'Chinese',
    english: 'English',
    winlinkMigrator: 'WinLink Migrator',
    systemDrive: 'System Drive',
    targetDrive: 'Target Drive',
    selectDrive: 'Select Drive',
    migrate: 'Migrate',
    cancel: 'Cancel',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    finish: 'Finish',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    danger: 'Danger',
    folder: 'Folder',
    file: 'File',
    files: 'Files',
    folders: 'Folders',
    totalSize: 'Total Size',
    freeSpace: 'Free Space',
    usedSpace: 'Used Space',
    scan: 'Scan',
    scanning: 'Scanning',
    scanComplete: 'Scan Complete',
    noAppsFound: 'No applications found',
    noDisksFound: 'No disks found',
    noLogsFound: 'No logs found',
    migrateTo: 'Migrate to',
    selectApps: 'Select Applications',
    selectedApps: 'Selected Applications',
    migrationSettings: 'Migration Settings',
    overwriteExisting: 'Overwrite Existing',
    createBackup: 'Create Backup',
    verifyAfterMove: 'Verify After Move',
    parallelExecution: 'Parallel Execution',
    migrationSummary: 'Migration Summary',
    startMigration: 'Start Migration',
    migrationInProgress: 'Migration in Progress',
    migrationComplete: 'Migration Complete',
    migrationFailed: 'Migration Failed',
    viewLogs: 'View Logs',
    close: 'Close',
    minimize: 'Minimize',
    maximize: 'Maximize',
    filter: 'Filter',
    clear: 'Clear',
    export: 'Export',
    search: 'Search',
    filterByType: 'Filter by Type',
    sortBy: 'Sort by',
    name: 'Name'
  },
  zh: {
    apps: '应用程序',
    analyzeSafety: '分析安全性',
    move: '迁移',
    status: '状态',
    size: '大小',
    path: '路径',
    ready: '准备好',
    analyzing: '分析',
    moving: '移动',
    moved: '已移动',
    error: '错误',
    paused: '暂停',
    verifying: '验证',
    idle: '闲置的',
    mkdir: '创建目录',
    robocopy: '复制文件',
    mklink: '创建链接',
    completed: '完毕',
    cleaning: '清理',
    safetyScore: '安全评分',
    aiAnalysis: 'AI 分析',
    progress: '进度',
    terminal: '终端',
    language: '语言',
    chinese: '中文',
    english: '英文',
    winlinkMigrator: 'WinLink 迁移器',
    systemDrive: '系统盘',
    targetDrive: '目标盘',
    selectDrive: '选择磁盘',
    migrate: '迁移',
    cancel: '取消',
    confirm: '确认',
    back: '返回',
    next: '下一步',
    finish: '完成',
    success: '成功',
    warning: '警告',
    info: '信息',
    danger: '危险',
    folder: '文件夹',
    file: '文件',
    files: '文件',
    folders: '文件夹',
    totalSize: '总大小',
    freeSpace: '可用空间',
    usedSpace: '已用空间',
    scan: '扫描',
    scanning: '扫描中',
    scanComplete: '扫描完成',
    noAppsFound: '未找到应用程序',
    noDisksFound: '未找到磁盘',
    noLogsFound: '未找到日志',
    migrateTo: '迁移到',
    selectApps: '选择应用程序',
    selectedApps: '已选择的应用程序',
    migrationSettings: '迁移设置',
    overwriteExisting: '覆盖现有文件',
    createBackup: '创建备份',
    verifyAfterMove: '迁移后验证',
    parallelExecution: '并行执行',
    migrationSummary: '迁移摘要',
    startMigration: '开始迁移',
    migrationInProgress: '迁移进行中',
    migrationComplete: '迁移完成',
    migrationFailed: '迁移失败',
    viewLogs: '查看日志',
    close: '关闭',
    minimize: '最小化',
    maximize: '最大化',
    filter: '筛选',
    clear: '清空',
    export: '导出',
    search: '搜索',
    filterByType: '按类型筛选',
    sortBy: '排序方式',
    name: '名称'
  }
};

export const translate = (key: keyof TranslationKeys, language: 'en' | 'zh' = 'zh'): string => {
  return translations[language][key] || key;
};
