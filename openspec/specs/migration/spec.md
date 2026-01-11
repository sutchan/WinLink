# 迁移规范

## 概述
迁移功能负责将应用程序数据从系统盘移动到其他分区，并创建 junction 链接以保持路径访问性。它处理整个迁移过程，包括目录创建、文件复制和 junction 链接创建。

## 需求

### 需求：迁移过程
系统应执行一系列步骤来迁移应用程序数据并创建 junction 链接。

#### 场景：迁移启动
- **WHEN** 用户启动迁移过程
- **THEN** 系统应将应用程序状态更改为 "移动" (Moving)
- **AND** 开始执行迁移步骤

#### 场景：目录创建
- **WHEN** 迁移过程开始
- **THEN** 系统应在目标位置不存在时创建目录
- **AND** 将迁移步骤更新为 "MKDIR"

#### 场景：文件复制
- **WHEN** 目录创建完成
- **THEN** 系统应使用 robocopy 复制文件数据
- **AND** 将迁移步骤更新为 "机器人复制" (Robocopy)

#### 场景：Junction 创建
- **WHEN** 文件复制完成
- **THEN** 系统应使用 mklink 创建 junction 链接
- **AND** 将迁移步骤更新为 "MKLINK"

#### 场景：迁移完成
- **WHEN** 所有步骤完成
- **THEN** 系统应将应用程序状态更改为 "已移动" (Moved)
- **AND** 将迁移步骤更新为 "完毕" (Completed)

### 需求：命令执行
系统应执行每个迁移步骤的适当 Windows 命令。

#### 场景：MkDir 命令
- **WHEN** 创建目标目录
- **THEN** 系统应执行 `mkdir "Target\Path"`
- **AND** 在终端中记录命令

#### 场景：Robocopy 命令
- **WHEN** 复制文件
- **THEN** 系统应执行 `robocopy "源" "目标" /E /COPYALL /MOVE`
- **AND** 在终端中记录命令

#### 场景：MkLink 命令
- **WHEN** 创建 junction 链接
- **THEN** 系统应执行 `mklink /J "源" "目标"`
- **AND** 在终端中记录命令

### 需求：增强迁移功能
系统应提供增强的迁移功能，以提高用户体验和可靠性。

#### 场景：恢复迁移
- **WHEN** 迁移过程中断
- **THEN** 系统应允许从中断点继续迁移
- **AND** 显示当前进度

#### 场景：并行迁移
- **WHEN** 选择多个应用程序
- **THEN** 系统应允许同时迁移多个应用程序
- **AND** 显示每个应用程序的进度

#### 场景：迁移回滚
- **WHEN** 迁移过程中发生错误
- **THEN** 系统应自动回滚到原始状态
- **AND** 显示错误消息

#### 场景：迁移前检查
- **WHEN** 用户启动迁移
- **THEN** 系统应检查目标磁盘空间和权限
- **AND** 如果检查失败则中止并显示错误

#### 场景：迁移计划
- **WHEN** 用户配置迁移设置
- **THEN** 系统应允许创建和保存迁移计划
- **AND** 稍后执行

#### 场景：增量迁移
- **WHEN** 迁移之前已迁移的应用程序
- **THEN** 系统应只迁移修改过的文件
- **AND** 跳过未更改的文件

## 数据结构

### MigrationConfig
```typescript
interface MigrationConfig {
  overwriteExisting: boolean;
  createBackup: boolean;
  verifyAfterMove: boolean;
  parallelExecution: boolean;
}
```

### AppFolder (带迁移字段)
```typescript
interface AppFolder {
  id: string;
  name: string;
  sourcePath: string;
  targetPath: string;
  size: string;
  migratedSize?: string;
  status: AppStatus;
  moveStep?: MoveStep;
  progress?: number;
  errorMessage?: string;
  backupPath?: string;
}
```

## 实现注意事项

### Web POC 与原生实现
- 在 Web POC 中，系统使用超时模拟 Windows 命令
- 在原生实现 (Tauri) 中，系统应执行真实的 Windows 命令

### 命令执行
- 对于 Tauri: 使用 `command` API 执行命令
- 需要处理 UAC (管理员权限) 以创建 junction

### 性能考虑
- 文件复制可能耗时，因此实现应：
  - 使用异步操作
  - 显示进度更新
  - 考虑对大型迁移使用多线程

### 错误处理
- 系统应处理各种错误场景：
  - 磁盘空间不足
  - 权限被拒绝错误
  - 文件锁定问题
  - 网络驱动器断开连接

### 安全考虑
- 在修改系统文件之前始终创建备份
- 实现错误恢复的回滚机制
- 迁移后验证数据完整性

### 测试考虑
- 使用各种应用程序大小和类型进行测试
- 测试错误恢复场景
- 在不同 Windows 版本上测试