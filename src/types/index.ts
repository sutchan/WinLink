// 应用程序状态
export enum AppStatus {
  READY = "准备好",
  ANALYZING = "分析",
  MOVING = "移动",
  MOVED = "已移动",
  ERROR = "错误",
  PAUSED = "暂停",
  VERIFYING = "验证"
}

// 迁移步骤
export enum MoveStep {
  IDLE = "闲置的",
  MKDIR = "MKDIR",
  ROBOCOPY = "机器人复制",
  MKLINK = "MKLINK",
  COMPLETED = "完毕",
  VERIFYING = "验证",
  CLEANING = "清理",
  DONE = "done"
}

// 应用程序文件夹
export interface AppFolder {
  id: string;
  name: string;
  sourcePath: string; // 原路径
  targetPath?: string; // 目标路径
  size: string;       // 占用空间
  migratedSize?: string; // 已迁移大小
  status: AppStatus;
  moveStep?: MoveStep;
  progress?: number; // 迁移进度百分比
  safetyScore?: number; // AI 评分 (0-100)
  aiAnalysis?: string;  // AI 分析建议
  aiAnalysisResult?: AiAnalysisResult; // AI 分析结果
  errorMessage?: string; // 错误信息
  lastModified?: string; // 最后修改时间
  backupPath?: string; // 备份路径
}

// 迁移配置
export interface MigrationConfig {
  overwriteExisting: boolean;
  createBackup: boolean;
  verifyAfterMove: boolean;
  parallelExecution: boolean;
}

// 终端日志条目
export interface TerminalLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'command';
}

// 磁盘信息
export interface DiskInfo {
  id: string;
  name: string;
  path: string;
  totalSpace: string;
  freeSpace: string;
  usedSpace: string;
}

// AI 分析结果
export interface AiAnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  recommendations: string[];
  warnings: string[];
  safeToMove: boolean;
}
