import { DiskInfo, AppFolder, AppStatus } from '../types';
import { mockDrives, mockApps } from '../utils/constants';

/**
 * 扫描系统中的磁盘
 * @returns 磁盘信息数组
 */
export const scanDrives = async (): Promise<DiskInfo[]> => {
  // 在实际 Tauri 环境中，这里应该使用 Tauri 的文件系统 API 来扫描真实磁盘
  // 目前使用模拟数据
  
  // 模拟扫描延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockDrives;
};

/**
 * 扫描指定磁盘中的应用程序
 * @param drivePath 磁盘路径，如 "C:"
 * @returns 应用程序文件夹数组
 */
export const scanApps = async (drivePath: string): Promise<AppFolder[]> => {
  // 在实际 Tauri 环境中，这里应该使用 Tauri 的文件系统 API 来扫描真实应用
  // 目前使用模拟数据，并根据选择的磁盘进行过滤
  
  // 模拟扫描延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 过滤出指定磁盘的应用
  const filteredApps = mockApps.filter(app => 
    app.sourcePath.startsWith(drivePath)
  );
  
  // 为每个应用设置初始状态
  return filteredApps.map(app => ({
    ...app,
    status: AppStatus.READY
  }));
};

/**
 * 获取磁盘空间信息
 * @param drivePath 磁盘路径，如 "C:"
 * @returns 磁盘空间信息
 */
export const getDriveSpace = async (drivePath: string): Promise<{ total: string; free: string; used: string }> => {
  // 在实际 Tauri 环境中，这里应该使用 Tauri 的文件系统 API 来获取真实磁盘空间
  // 目前从模拟数据中查找
  
  const drive = mockDrives.find(d => d.path === drivePath);
  if (drive) {
    return {
      total: drive.totalSpace,
      free: drive.freeSpace,
      used: drive.usedSpace
    };
  }
  
  // 如果找不到指定磁盘，返回默认值
  return {
    total: '0 GB',
    free: '0 GB',
    used: '0 GB'
  };
};

/**
 * 计算文件夹大小
 * @param folderPath 文件夹路径
 * @returns 文件夹大小，格式为字符串
 */
export const getFolderSize = async (folderPath: string): Promise<string> => {
  // 在实际 Tauri 环境中，这里应该使用 Tauri 的文件系统 API 来计算真实文件夹大小
  // 目前返回模拟大小
  
  // 模拟计算延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 从模拟应用中查找
  const app = mockApps.find(a => a.sourcePath === folderPath);
  if (app) {
    return app.size;
  }
  
  // 如果找不到，返回默认值
  return '0 MB';
};
