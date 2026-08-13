# 核心模型规范

## 描述
核心数据模型定义了 WinLink Migrator 应用程序的基本数据结构和状态管理。这些类型用于表示应用程序状态、迁移步骤跟踪、应用程序文件夹数据结构和扩展数据模型，被所有功能模块使用。

> 说明：下方 `TerminalLogEntry`、`DiskInfo` 等为规划中的数据模型（对应终端日志、磁盘检测功能），当前版本代码尚未落地对应实现；`AppFolder`、`MigrationConfig`、`MoveStep`、`AppStatus` 与实际 `src/types/` 一致。
## 需求
### 需求：应用程序状态管理
系统应定义一组应用程序状态来跟踪整个迁移过程。
#### 场景：应用程序初始加载
- **WHEN** 应用程序首次加载
- **THEN** 所有应用程序应处于 "准备好" (Ready) 状态
#### 场景：AI 分析启动
- **WHEN** 用户启动 AI 安全分析
- **THEN** 应用程序状态应更新为 "分析" (Analyzing)

#### 场景：迁移启动
- **WHEN** 用户启动迁移过程
- **THEN** 应用程序状态应更新为 "移动" (Moving)

#### 场景：迁移完成
- **WHEN** 迁移过程成功完成
- **THEN** 应用程序状态应更新为 "已移动" (Moved)

#### 场景：发生错误
- **WHEN** 任何过程中发生错误
- **THEN** 应用程序状态应更新为 "错误" (Error)

### 需求：迁移步骤跟踪
系统应定义一组迁移步骤来跟踪整个迁移过程的详细进度。
#### 场景：迁移开始
- **WHEN** 迁移开始
- **THEN** 迁移步骤应设置为 "空闲的" (Idle)

#### 场景：目录创建
- **WHEN** 正在创建目标目录
- **THEN** 迁移步骤应设置为 "MKDIR"

#### 场景：文件复制
- **WHEN** 正在复制文件
- **THEN** 迁移步骤应设置为 "机器复制" (Robocopy)

#### 场景：Junction 创建
- **WHEN** 正在创建 junction 链接
- **THEN** 迁移步骤应设置为 "MKLINK"

#### 场景：迁移完成
- **WHEN** 所有迁移操作完成
- **THEN** 迁移步骤应设置为 "完成" (Completed)

### 需求：应用程序文件夹数据结构
系统应定义一个数据结构来表示要迁移的应用程序文件夹。
#### 场景：文件夹数据表示
- **WHEN** 扫描到应用程序文件夹
- **THEN** 系统应创建一个 AppFolder 对象，包含 id、name、sourcePath、size、status 和可选字段
- **AND** 在应用程序卡片中显示这些信息

#### 场景：AI 分析结果
- **WHEN** AI 分析完成
- **THEN** 系统应使用 safetyScore 和 aiAnalysis 字段更新 AppFolder 对象
- **AND** 在应用程序卡片中显示这些信息

#### 场景：迁移进度
- **WHEN** 迁移进行中
- **THEN** 系统应使用 moveStep 和 progress 字段更新 AppFolder 对象
- **AND** 在应用程序卡片中显示这些信息

### 需求：扩展数据模型
系统应定义其他数据类型以支持高级功能。
#### 场景：迁移配置
- **WHEN** 用户配置迁移设置
- **THEN** 系统应使用 MigrationConfig 类型存储首选项
- **AND** 在后续迁移中应用这些设置

#### 场景：终端日志
- **WHEN** 系统事件发生
- **THEN** 系统应创建 TerminalLogEntry 对象来记录详细信息
- **AND** 在终端组件中显示它

#### 场景：磁盘信息
- **WHEN** 扫描系统
- **THEN** 系统应创建 DiskInfo 对象来表示每个磁盘
- **AND** 在磁盘选择界面中显示它

## 数据结构

> 以下类型定义与 `src/types/index.ts` 保持一致（实际为 enum / interface）。

### AppStatus（enum）
```typescript
enum AppStatus {
  READY = "准备好",
  ANALYZING = "分析",
  MOVING = "移动",
  MOVED = "已移动",
  ERROR = "错误",
  PAUSED = "暂停",
  VERIFYING = "验证"
}
```

### MoveStep（enum）
```typescript
enum MoveStep {
  IDLE = "闲置的",
  MKDIR = "MKDIR",
  ROBOCOPY = "机器人复制",
  MKLINK = "MKLINK",
  COMPLETED = "完毕",
  VERIFYING = "验证",
  CLEANING = "清理",
  DONE = "done"
}
```

### AppFolder
```typescript
interface AppFolder {
  id: string;
  name: string;
  sourcePath: string;        // 原路径
  targetPath?: string;       // 目标路径
  size: string;              // 占用空间
  migratedSize?: string;     // 已迁移大小
  status: AppStatus;
  moveStep?: MoveStep;       // 迁移步骤
  progress?: number;         // 迁移进度百分比
  safetyScore?: number;      // 安全评分 (0-100)
  aiAnalysis?: string;       // AI 分析建议文本
  aiAnalysisResult?: AiAnalysisResult; // AI 分析结果
  errorMessage?: string;     // 错误信息
  lastModified?: string;     // 最后修改时间
  backupPath?: string;       // 备份路径
}
```

### MigrationConfig
```typescript
interface MigrationConfig {
  overwriteExisting: boolean;
  createBackup: boolean;
  verifyAfterMove: boolean;
  parallelExecution: boolean;
}
```

### AiAnalysisResult
```typescript
interface AiAnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  recommendations: string[];
  warnings: string[];
  safeToMove: boolean;
}
```

### TerminalLogEntry（规划，终端功能未实现）
```typescript
interface TerminalLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'command';
}
```

### DiskInfo（规划，磁盘检测功能未实现）
```typescript
interface DiskInfo {
  id: string;
  name: string;
  path: string;
  totalSpace: string;
  freeSpace: string;
  usedSpace: string;
}
```

## 实现注意事项

### 状态管理
- 使用 React Context API 或状态管理库来管理全局应用状态
- 确保状态更新是不可变的，以避免意外的副作用
- 实现状态持久化，以便在应用程序重启后恢复状态

### 类型安全
- 利用 TypeScript 的类型系统确保数据结构的一致性
- 为所有数据模型添加适当的类型注释
- 考虑使用枚举类型来表示状态和步骤，以提高代码可读性

### 性能优化
- 对于大型应用程序列表，实现虚拟滚动以提高渲染性能
- 考虑使用不可变数据结构来优化状态更新
- 实现适当的缓存策略，以避免重复计算和网络请求