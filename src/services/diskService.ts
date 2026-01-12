import { AppFolder, AppStatus, DiskInfo } from '../types';
import { mockDisks } from '../constants';

/**
 * 扫描磁盘获取磁盘信息
 * @returns 磁盘信息数组
 */
export const scanDisks = async (): Promise<DiskInfo[]> => {
  // 在真实环境中，这里会使用 Tauri 的文件系统 API 扫描真实磁盘
  // 目前返回模拟数据
  return new Promise((resolve) => {
    // 模拟扫描延迟
    setTimeout(() => {
      resolve(mockDisks);
    }, 1000);
  });
};

/**
 * 扫描指定磁盘获取应用程序文件夹
 * @param diskPath 磁盘路径
 * @param onProgress 进度回调函数
 * @returns 应用程序文件夹数组
 */
export const scanApplications = async (
  diskPath: string,
  onProgress?: (progress: number) => void
): Promise<AppFolder[]> => {
  // 在真实环境中，这里会使用 Tauri 的文件系统 API 扫描真实应用程序
  // 目前返回模拟数据，并模拟进度
  return new Promise((resolve) => {
    const mockApps = [
      {
        id: '1',
        name: 'Steam 游戏库',
        sourcePath: `${diskPath}\\Program Files (x86)\\Steam`,
        size: '150 GB',
        status: AppStatus.READY
      },
      {
        id: '2',
        name: 'Adobe Creative Cloud',
        sourcePath: `${diskPath}\\Program Files\\Adobe`,
        size: '80 GB',
        status: AppStatus.READY
      },
      {
        id: '3',
        name: 'Node.js 项目',
        sourcePath: `${diskPath}\\Users\\User\\Documents\\Projects`,
        size: '25 GB',
        status: AppStatus.READY
      },
      {
        id: '4',
        name: 'Visual Studio Code',
        sourcePath: `${diskPath}\\Users\\User\\AppData\\Local\\Programs\\Microsoft VS Code`,
        size: '10 GB',
        status: AppStatus.READY
      },
      {
        id: '5',
        name: 'Docker 容器',
        sourcePath: `${diskPath}\\ProgramData\\Docker`,
        size: '45 GB',
        status: AppStatus.READY
      },
      {
        id: '6',
        name: '照片库',
        sourcePath: `${diskPath}\\Users\\User\\Pictures`,
        size: '60 GB',
        status: AppStatus.READY
      }
    ];

    // 模拟扫描进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) {
        onProgress(progress);
      }
      if (progress >= 100) {
        clearInterval(interval);
        resolve(mockApps);
      }
    }, 200);
  });
};

/**
 * 分析应用文件夹中的文件类型分布
 * @param folderPath 应用文件夹路径
 * @returns 文件类型分布对象
 */
export const analyzeFileTypeDistribution = async (
  _folderPath: string
): Promise<Record<string, number>> => {
  // 在真实环境中，这里会扫描文件夹中的文件类型
  // 目前返回模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        '.exe': 10,
        '.dll': 25,
        '.json': 5,
        '.txt': 8,
        '.jpg': 15,
        '.png': 12,
        '.js': 20,
        '.ts': 18,
        '.css': 7,
        '.html': 6
      });
    }, 500);
  });
};

/**
 * 计算文件夹大小
 * @param folderPath 文件夹路径
 * @returns 文件夹大小（字符串格式）
 */
export const calculateFolderSize = async (_folderPath: string): Promise<string> => {
  // 在真实环境中，这里会计算真实文件夹大小
  // 目前返回模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      // 生成随机大小
      const size = Math.floor(Math.random() * 200) + 5;
      resolve(`${size} GB`);
    }, 300);
  });
};

/**
 * 检查磁盘空间是否充足
 * @param diskPath 磁盘路径
 * @param requiredSpace 需要的空间（字节）
 * @returns 是否空间充足
 */
export const checkDiskSpace = async (
  diskPath: string,
  requiredSpace: number
): Promise<boolean> => {
  // 在真实环境中，这里会检查真实磁盘空间
  // 目前使用模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟检查
      const disk = mockDisks.find(d => d.path === diskPath);
      if (disk) {
        // 简单模拟：假设 1 GB = 10^9 字节
        const freeSpaceGB = parseFloat(disk.freeSpace.replace(' GB', ''));
        const freeSpaceBytes = freeSpaceGB * 1000000000;
        resolve(freeSpaceBytes >= requiredSpace);
      } else {
        resolve(false);
      }
    }, 200);
  });
};

/**
 * 排序应用程序文件夹
 * @param apps 应用程序文件夹数组
 * @param sortBy 排序字段（name, size, status）
 * @param sortOrder 排序顺序（asc, desc）
 * @returns 排序后的应用程序文件夹数组
 */
export const sortApplications = (
  apps: AppFolder[],
  sortBy: 'name' | 'size' | 'status' | 'path',
  sortOrder: 'asc' | 'desc'
): AppFolder[] => {
  return [...apps].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'size':
        // 解析大小字符串为数字进行比较
        const sizeA = parseFloat(a.size.replace(/[^\d.]/g, ''));
        const sizeB = parseFloat(b.size.replace(/[^\d.]/g, ''));
        comparison = sizeA - sizeB;
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'path':
        comparison = a.sourcePath.localeCompare(b.sourcePath);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
};

/**
 * 过滤应用程序文件夹
 * @param apps 应用程序文件夹数组
 * @param filters 过滤条件
 * @returns 过滤后的应用程序文件夹数组
 */
export const filterApplications = (
  apps: AppFolder[],
  filters: {
    minSize?: number;
    maxSize?: number;
    status?: AppStatus[];
    searchTerm?: string;
  }
): AppFolder[] => {
  return apps.filter(app => {
    // 大小过滤
    if (filters.minSize !== undefined || filters.maxSize !== undefined) {
      const size = parseFloat(app.size.replace(/[^\d.]/g, ''));
      if (filters.minSize !== undefined && size < filters.minSize) {
        return false;
      }
      if (filters.maxSize !== undefined && size > filters.maxSize) {
        return false;
      }
    }

    // 状态过滤
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(app.status)) {
        return false;
      }
    }

    // 搜索词过滤
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      if (!app.name.toLowerCase().includes(searchLower) &&
          !app.sourcePath.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    return true;
  });
};
