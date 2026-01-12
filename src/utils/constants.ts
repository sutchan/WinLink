import { AppFolder, AppStatus } from '../types';

// 模拟应用数据
export const mockApps: AppFolder[] = [
  {
    id: '1',
    name: 'Steam',
    sourcePath: 'C:\\Program Files (x86)\\Steam',
    size: '15.2 GB',
    status: AppStatus.READY,
    moveStep: undefined,
    safetyScore: undefined,
    aiAnalysis: undefined,
    aiAnalysisResult: undefined,
    targetPath: undefined,
    lastModified: '2026-01-10T14:30:00',
    progress: undefined,
    errorMessage: undefined,
    migratedSize: undefined,
    backupPath: undefined,
  },
  {
    id: '2',
    name: 'Discord',
    sourcePath: 'C:\\Users\\User\\AppData\\Local\\Discord',
    size: '2.1 GB',
    status: AppStatus.READY,
    moveStep: undefined,
    safetyScore: undefined,
    aiAnalysis: undefined,
    aiAnalysisResult: undefined,
    targetPath: undefined,
    lastModified: '2026-01-11T09:15:00',
    progress: undefined,
    errorMessage: undefined,
    migratedSize: undefined,
    backupPath: undefined,
  },
  {
    id: '3',
    name: 'Adobe Creative Cloud',
    sourcePath: 'C:\\Program Files\\Adobe',
    size: '8.7 GB',
    status: AppStatus.READY,
    moveStep: undefined,
    safetyScore: undefined,
    aiAnalysis: undefined,
    aiAnalysisResult: undefined,
    targetPath: undefined,
    lastModified: '2026-01-09T16:45:00',
    progress: undefined,
    errorMessage: undefined,
    migratedSize: undefined,
    backupPath: undefined,
  },
  {
    id: '4',
    name: 'Visual Studio Code',
    sourcePath: 'C:\\Users\\User\\AppData\\Local\\Programs\\Microsoft VS Code',
    size: '1.5 GB',
    status: AppStatus.READY,
    moveStep: undefined,
    safetyScore: undefined,
    aiAnalysis: undefined,
    aiAnalysisResult: undefined,
    targetPath: undefined,
    lastModified: '2026-01-11T11:20:00',
    progress: undefined,
    errorMessage: undefined,
    migratedSize: undefined,
    backupPath: undefined,
  },
  {
    id: '5',
    name: 'Spotify',
    sourcePath: 'C:\\Users\\User\\AppData\\Roaming\\Spotify',
    size: '3.8 GB',
    status: AppStatus.READY,
    moveStep: undefined,
    safetyScore: undefined,
    aiAnalysis: undefined,
    aiAnalysisResult: undefined,
    targetPath: undefined,
    lastModified: '2026-01-10T20:10:00',
    progress: undefined,
    errorMessage: undefined,
    migratedSize: undefined,
    backupPath: undefined,
  },
  {
    id: '6',
    name: 'Epic Games Launcher',
    sourcePath: 'C:\\Program Files\\Epic Games\\Launcher',
    size: '5.2 GB',
    status: AppStatus.READY,
    moveStep: undefined,
    safetyScore: undefined,
    aiAnalysis: undefined,
    aiAnalysisResult: undefined,
    targetPath: undefined,
    lastModified: '2026-01-08T13:50:00',
    progress: undefined,
    errorMessage: undefined,
    migratedSize: undefined,
    backupPath: undefined,
  },
];

// 模拟磁盘数据
export const mockDrives = [
  {
    id: '1',
    name: '系统盘',
    path: 'C:',
    totalSpace: '256 GB',
    freeSpace: '45 GB',
    usedSpace: '211 GB',
  },
  {
    id: '2',
    name: '数据盘',
    path: 'D:',
    totalSpace: '512 GB',
    freeSpace: '320 GB',
    usedSpace: '192 GB',
  },
  {
    id: '3',
    name: '游戏盘',
    path: 'E:',
    totalSpace: '1 TB',
    freeSpace: '650 GB',
    usedSpace: '350 GB',
  },
];

// 应用配置
export const appConfig = {
  version: '0.1.0',
  name: 'WinLink Migrator',
  description: 'Windows 应用程序数据迁移工具',
  defaultTargetDrive: 'D:',
  defaultTargetPath: 'D:\\Apps',
  aiAnalysisTimeout: 30000, // 30秒超时
  migrationTimeout: 3600000, // 1小时超时
};

// AI 分析提示模板
export const aiAnalysisPrompt = `
你是一个 Windows 系统专家，需要评估一个应用程序文件夹是否适合通过 Junction 链接迁移到其他磁盘分区。

请分析以下应用程序信息：
- 应用名称：{appName}
- 源路径：{sourcePath}
- 大小：{size}

请回答以下问题：
1. 该文件夹是否可能包含硬编码的路径？
2. 该文件夹是否属于系统服务或需要在特定路径运行的应用？
3. 该文件夹是否适合通过 Junction 链接迁移？
4. 迁移后可能出现的问题和解决方案？

请以 JSON 格式返回分析结果，包含以下字段：
{
  "riskLevel": "low" | "medium" | "high",
  "confidence": 0-100,
  "recommendations": ["建议1", "建议2"],
  "warnings": ["警告1", "警告2"],
  "safeToMove": true | false
}
`;
