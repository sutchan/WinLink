import { AppFolder, AppStatus } from '../types';

// 模拟应用程序文件夹数据
export const mockAppFolders: AppFolder[] = [
  {
    id: '1',
    name: 'Steam 游戏库',
    sourcePath: 'C:\\Program Files (x86)\\Steam',
    size: '150 GB',
    status: AppStatus.READY
  },
  {
    id: '2',
    name: 'Adobe Creative Cloud',
    sourcePath: 'C:\\Program Files\\Adobe',
    size: '80 GB',
    status: AppStatus.READY
  },
  {
    id: '3',
    name: 'Node.js 项目',
    sourcePath: 'C:\\Users\\User\\Documents\\Projects',
    size: '25 GB',
    status: AppStatus.READY
  },
  {
    id: '4',
    name: 'Visual Studio Code',
    sourcePath: 'C:\\Users\\User\\AppData\\Local\\Programs\\Microsoft VS Code',
    size: '10 GB',
    status: AppStatus.READY
  },
  {
    id: '5',
    name: 'Docker 容器',
    sourcePath: 'C:\\ProgramData\\Docker',
    size: '45 GB',
    status: AppStatus.READY
  },
  {
    id: '6',
    name: '照片库',
    sourcePath: 'C:\\Users\\User\\Pictures',
    size: '60 GB',
    status: AppStatus.READY
  }
];

// 模拟磁盘信息
export const mockDisks = [
  {
    id: '1',
    name: '系统盘',
    path: 'C:',
    totalSpace: '512 GB',
    freeSpace: '120 GB',
    usedSpace: '392 GB'
  },
  {
    id: '2',
    name: '数据盘',
    path: 'D:',
    totalSpace: '1 TB',
    freeSpace: '750 GB',
    usedSpace: '250 GB'
  },
  {
    id: '3',
    name: '游戏盘',
    path: 'E:',
    totalSpace: '2 TB',
    freeSpace: '1.5 TB',
    usedSpace: '500 GB'
  }
];

// 默认迁移配置
export const defaultMigrationConfig = {
  overwriteExisting: false,
  createBackup: true,
  verifyAfterMove: true,
  parallelExecution: false
};
