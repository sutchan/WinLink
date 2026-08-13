# 迁移规范

## 描述
迁移功能负责将应用程序数据从系统盘移动到其他分区，并创建 junction 链接以保持路径访问性。它编排整个迁移过程，包括目录创建、文件复制和 junction 链接创建。

> 当前状态：迁移流程为**模拟实现**（`src/services/migrationService.ts` 中的 `simulateOperation` 仅延时模拟各步骤），并不真正执行磁盘读写或系统命令。真实 robocopy / mklink 命令的执行为未来演进目标（可能借助 Tauri 等原生能力）。本规范描述目标行为，已实现的模拟部分以「已实现」标注。
## 需求
### 需求：迁移过程
系统应执行一系列步骤来迁移应用程序数据并创建 junction 链接。
#### 场景：迁移启动
- **WHEN** 用户启动迁移过程
- **THEN** 系统应将应用程序状态更新为 "移动" (Moving)
- **AND** 开始执行迁移步骤
#### 场景：目录创建
- **WHEN** 迁移过程开始
- **THEN** 系统应在目标位置不存在时创建目录
- **AND** 将迁移步骤更新为 "MKDIR"

#### 场景：文件复制
- **WHEN** 目录创建完成
- **THEN** 系统应使用 robocopy 复制文件数据
- **AND** 将迁移步骤更新为 "机器复制" (Robocopy)

#### 场景：Junction 创建
- **WHEN** 文件复制完成
- **THEN** 系统应使用 mklink 创建 junction 链接
- **AND** 将迁移步骤更新为 "MKLINK"

#### 场景：迁移完成
- **WHEN** 所有步骤完成
- **THEN** 系统应将应用程序状态更新为 "已移动" (Moved)
- **AND** 将迁移步骤更新为 "完成" (Completed)

### 需求：命令执行（目标行为，尚未实现）
系统最终应执行每个迁移步骤的相应 Windows 命令。当前为模拟实现，不执行真实命令。
#### 场景：MkDir 命令（目标）
- **WHEN** 创建目标目录
- **THEN** 系统应执行 `mkdir "Target\Path"`

#### 场景：Robocopy 命令（目标）
- **WHEN** 复制文件
- **THEN** 系统应执行 `robocopy "源" "目标" /E /COPYALL /MOVE`

#### 场景：MkLink 命令（目标）
- **WHEN** 创建 junction 链接
- **THEN** 系统应执行 `mklink /J "源" "目标"`

### 需求：增强迁移功能
系统应提供增强的迁移功能，以提高用户体验和可靠性。
#### 场景：恢复迁移
- **WHEN** 迁移过程中断
- **THEN** 系统应支持从中断点继续迁移（目标，当前未实现）
- **AND** 显示当前进度

#### 场景：并行迁移（已实现：批量支持 serial/parallel）
- **WHEN** 选择多个应用程序
- **THEN** 系统应支持同时迁移多个应用程序
- **AND** 显示每个应用程序的进度

#### 场景：迁移回滚（已实现：回滚流程 CLEANING）
- **WHEN** 迁移过程中发生错误或用户取消
- **THEN** 系统应支持回滚到初始状态
- **AND** 显示相应消息

#### 场景：迁移取消（已实现：AbortController）
- **WHEN** 用户取消进行中的迁移
- **THEN** 系统应中止当前迁移流程

#### 场景：迁移前检查（目标，尚未实现）
- **WHEN** 用户启动迁移
- **THEN** 系统应检查目标目录空间和权限
- **AND** 如果检查失败则中止并显示错误
#### 场景：迁移计划（目标，尚未实现）
- **WHEN** 用户配置迁移设置
- **THEN** 系统应支持创建和保存迁移计划
- **AND** 后续执行

#### 场景：增量迁移（目标，尚未实现）
- **WHEN** 迁移之前已迁移的应用程序
- **THEN** 系统应只迁移更改的文件
- **AND** 跳过未更改的文件

## 数据结构

### MigrationConfig
```typescript
interface MigrationConfig {
  targetDrive: string;
  targetPath: string;
  createJunction: boolean;
  preservePermissions: boolean;
  moveMethod: 'robocopy' | 'powershell';
}
```

### MigrationStep
```typescript
type MigrationStep = 'Idle' | 'MKDIR' | 'Robocopy' | 'MKLINK' | 'Completed';
```

## 实现注意事项

### 当前实现（模拟）
- 各步骤通过 `simulateOperation` 延时模拟，不真正读写磁盘或执行系统命令
- 使用 `AbortController` 支持取消；回滚流程状态为 `CLEANING`
- 进度通过回调实时回传 UI（MigrationModal 进度条）

### 目标实现（未来）
- 通过原生能力（如 Tauri）以子进程执行 Windows 命令（mkdir / robocopy / mklink）
- 实现命令执行的错误处理，以捕获和显示错误
- 确保命令参数经白名单校验，防止命令注入

### 进度跟踪
- 实现详细的进度跟踪，以显示当前步骤和完成百分比
- 考虑使用事件系统来通知 UI 组件有关进度更改
- 确保进度数据的实时更新，以提供良好的用户体验

### 错误处理
- 实现全面的错误处理，以应对各种迁移失败场景
- 提供清晰的错误消息，帮助用户理解问题
- 考虑实现自动错误恢复机制，以提高迁移成功率