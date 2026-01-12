import { AppFolder, AppStatus, MoveStep, MigrationConfig } from '../types';
import { defaultMigrationConfig } from '../constants';

interface MigrationProgress {
  step: MoveStep;
  progress: number;
  currentFile?: string;
  totalFiles?: number;
  currentBytes?: number;
  totalBytes?: number;
}

interface MigrationResult {
  success: boolean;
  app: AppFolder;
  error?: string;
  log: string[];
}

class MigrationService {
  private migrationsInProgress: Map<string, AbortController> = new Map();

  /**
   * 执行迁移流程
   * @param app 应用程序文件夹
   * @param targetPath 目标路径
   * @param config 迁移配置
   * @param onProgress 进度回调函数
   * @returns 迁移结果
   */
  async migrateApp(
    app: AppFolder,
    targetPath: string,
    config: MigrationConfig = defaultMigrationConfig,
    onProgress?: (progress: MigrationProgress) => void
  ): Promise<MigrationResult> {
    const abortController = new AbortController();
    this.migrationsInProgress.set(app.id, abortController);

    const log: string[] = [];
    let currentStep: MoveStep = MoveStep.IDLE;

    try {
      // 1. 预检查
      log.push(`开始迁移 ${app.name} 到 ${targetPath}`);
      log.push(`源路径: ${app.sourcePath}`);
      log.push(`目标路径: ${targetPath}`);

      // 2. 创建目标目录
      currentStep = MoveStep.MKDIR;
      if (onProgress) {
        onProgress({ step: currentStep, progress: 0 });
      }
      log.push(`步骤 1/3: 创建目标目录`);
      
      // 模拟创建目录
      await this.simulateOperation(1000);
      log.push(`目标目录创建成功`);
      
      if (onProgress) {
        onProgress({ step: currentStep, progress: 100 });
      }

      // 3. 复制文件
      currentStep = MoveStep.ROBOCOPY;
      if (onProgress) {
        onProgress({ step: currentStep, progress: 0, totalFiles: 100, totalBytes: 1024 * 1024 * 1024 });
      }
      log.push(`步骤 2/3: 复制文件`);

      // 模拟文件复制进度
      for (let i = 0; i <= 100; i += 10) {
        if (abortController.signal.aborted) {
          throw new Error('迁移已取消');
        }
        
        await this.simulateOperation(200);
        if (onProgress) {
          onProgress({
            step: currentStep,
            progress: i,
            currentFile: `文件 ${Math.floor(i / 10) + 1}`,
            totalFiles: 100,
            currentBytes: (i / 100) * 1024 * 1024 * 1024,
            totalBytes: 1024 * 1024 * 1024
          });
        }
      }
      
      log.push(`文件复制成功`);

      // 4. 创建 Junction 链接
      currentStep = MoveStep.MKLINK;
      if (onProgress) {
        onProgress({ step: currentStep, progress: 0 });
      }
      log.push(`步骤 3/3: 创建 Junction 链接`);

      // 模拟创建链接
      await this.simulateOperation(500);
      log.push(`Junction 链接创建成功`);

      if (onProgress) {
        onProgress({ step: currentStep, progress: 100 });
      }

      // 5. 验证（如果配置了验证）
      if (config.verifyAfterMove) {
        currentStep = MoveStep.VERIFYING;
        if (onProgress) {
          onProgress({ step: currentStep, progress: 0 });
        }
        log.push(`步骤 4/4: 验证迁移结果`);

        // 模拟验证
        await this.simulateOperation(1000);
        log.push(`验证成功`);

        if (onProgress) {
          onProgress({ step: currentStep, progress: 100 });
        }
      }

      // 6. 清理（如果需要）
      currentStep = MoveStep.COMPLETED;
      if (onProgress) {
        onProgress({ step: currentStep, progress: 100 });
      }
      log.push(`迁移完成`);

      // 更新应用状态
      const updatedApp: AppFolder = {
        ...app,
        status: AppStatus.MOVED,
        targetPath,
        moveStep: MoveStep.COMPLETED,
        progress: 100
      };

      this.migrationsInProgress.delete(app.id);

      return {
        success: true,
        app: updatedApp,
        log
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      log.push(`错误: ${errorMessage}`);
      
      // 更新应用状态为错误
      const updatedApp: AppFolder = {
        ...app,
        status: AppStatus.ERROR,
        moveStep: currentStep,
        errorMessage
      };

      this.migrationsInProgress.delete(app.id);

      return {
        success: false,
        app: updatedApp,
        error: errorMessage,
        log
      };
    }
  }

  /**
   * 取消迁移
   * @param appId 应用程序 ID
   * @returns 是否取消成功
   */
  cancelMigration(appId: string): boolean {
    const controller = this.migrationsInProgress.get(appId);
    if (controller) {
      controller.abort();
      this.migrationsInProgress.delete(appId);
      return true;
    }
    return false;
  }

  /**
   * 暂停迁移
   * @param appId 应用程序 ID
   * @returns 是否暂停成功
   */
  pauseMigration(appId: string): boolean {
    // 实际实现中，这里会暂停文件复制操作
    // 目前返回 false，表示暂不支持
    return false;
  }

  /**
   * 恢复迁移
   * @param appId 应用程序 ID
   * @returns 是否恢复成功
   */
  resumeMigration(appId: string): boolean {
    // 实际实现中，这里会恢复暂停的文件复制操作
    // 目前返回 false，表示暂不支持
    return false;
  }

  /**
   * 回滚迁移
   * @param app 应用程序文件夹
   * @param onProgress 进度回调函数
   * @returns 回滚结果
   */
  async rollbackMigration(
    app: AppFolder,
    onProgress?: (progress: MigrationProgress) => void
  ): Promise<MigrationResult> {
    const log: string[] = [];

    try {
      log.push(`开始回滚 ${app.name} 的迁移`);
      
      // 1. 检查目标路径是否存在
      log.push(`检查目标路径: ${app.targetPath}`);
      
      // 2. 删除 Junction 链接
      if (onProgress) {
        onProgress({ step: MoveStep.CLEANING, progress: 0 });
      }
      log.push(`步骤 1/3: 删除 Junction 链接`);
      
      // 模拟删除链接
      await this.simulateOperation(500);
      log.push(`Junction 链接删除成功`);
      
      if (onProgress) {
        onProgress({ step: MoveStep.CLEANING, progress: 33 });
      }

      // 3. 将文件移回源路径
      if (onProgress) {
        onProgress({ step: MoveStep.CLEANING, progress: 33 });
      }
      log.push(`步骤 2/3: 将文件移回源路径`);
      
      // 模拟文件移动
      for (let i = 33; i <= 66; i += 10) {
        await this.simulateOperation(200);
        if (onProgress) {
          onProgress({ step: MoveStep.CLEANING, progress: i });
        }
      }
      log.push(`文件移回成功`);

      // 4. 删除目标目录
      if (onProgress) {
        onProgress({ step: MoveStep.CLEANING, progress: 66 });
      }
      log.push(`步骤 3/3: 删除目标目录`);
      
      // 模拟删除目录
      await this.simulateOperation(500);
      log.push(`目标目录删除成功`);
      
      if (onProgress) {
        onProgress({ step: MoveStep.CLEANING, progress: 100 });
      }

      log.push(`回滚完成`);

      // 更新应用状态
      const updatedApp: AppFolder = {
        ...app,
        status: AppStatus.READY,
        moveStep: MoveStep.IDLE,
        targetPath: undefined,
        progress: 0,
        errorMessage: undefined
      };

      return {
        success: true,
        app: updatedApp,
        log
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      log.push(`错误: ${errorMessage}`);
      
      // 更新应用状态为错误
      const updatedApp: AppFolder = {
        ...app,
        status: AppStatus.ERROR,
        errorMessage
      };

      return {
        success: false,
        app: updatedApp,
        error: errorMessage,
        log
      };
    }
  }

  /**
   * 并行迁移多个应用
   * @param apps 应用程序文件夹数组
   * @param targetPath 目标路径
   * @param config 迁移配置
   * @param onProgress 进度回调函数
   * @returns 迁移结果数组
   */
  async migrateMultipleApps(
    apps: AppFolder[],
    targetPath: string,
    config: MigrationConfig = defaultMigrationConfig,
    onProgress?: (appId: string, progress: MigrationProgress) => void
  ): Promise<MigrationResult[]> {
    if (!config.parallelExecution) {
      // 串行执行
      const results: MigrationResult[] = [];
      for (const app of apps) {
        const result = await this.migrateApp(
          app,
          `${targetPath}\\${app.name}`,
          config,
          (progress) => onProgress?.(app.id, progress)
        );
        results.push(result);
      }
      return results;
    } else {
      // 并行执行
      const promises = apps.map(app => 
        this.migrateApp(
          app,
          `${targetPath}\\${app.name}`,
          config,
          (progress) => onProgress?.(app.id, progress)
        )
      );
      return Promise.all(promises);
    }
  }

  /**
   * 检查目标路径是否有效
   * @param targetPath 目标路径
   * @param requiredSpace 需要的空间（字节）
   * @returns 检查结果
   */
  async checkTargetPath(
    targetPath: string,
    requiredSpace: number
  ): Promise<{ valid: boolean; error?: string; availableSpace?: number }> {
    // 实际实现中，这里会检查目标路径是否存在、权限是否足够、空间是否充足
    // 目前返回模拟结果
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          valid: true,
          availableSpace: requiredSpace * 2
        });
      }, 500);
    });
  }

  /**
   * 模拟操作延迟
   * @param ms 延迟时间（毫秒）
   */
  private async simulateOperation(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// 导出单例实例
export const migrationService = new MigrationService();
