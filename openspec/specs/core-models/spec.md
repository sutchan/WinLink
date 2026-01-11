# 核心模型规范

## 概述
核心数据模型定义了 WinLink Migrator 应用程序的基本数据结构和状态管理。这些模型用于表示应用程序状态、迁移进度和用户数据，被所有功能模块使用。

## 需求

### 需求：应用程序状态管理
系统应定义一组应用程序状态来跟踪迁移过程。

#### 场景：应用程序初始加载
- **WHEN** 应用程序首次加载
- **THEN** 所有应用程序应处于 "准备好" (Ready) 状态

#### 场景：AI 分析启动
- **WHEN** 用户启动 AI 安全分析
- **THEN** 应用程序状态应更改为 "分析" (Analyzing)

#### 场景：迁移启动
- **WHEN** 用户启动迁移过程
- **THEN** 应用程序状态应更改为 "移动" (Moving)

#### 场景：迁移完成
- **WHEN** 迁移过程成功完成
- **THEN** 应用程序状态应更改为 "已移动" (Moved)

#### 场景：发生错误
- **WHEN** 任何过程中发生错误
- **THEN** 应用程序状态应更改为 "错误" (Error)

### 需求：迁移步骤跟踪
系统应定义一组迁移步骤来跟踪迁移过程的详细进度。

#### 场景：迁移开始
- **WHEN** 迁移开始
- **THEN** 迁移步骤应设置为 "闲置的" (Idle)

#### 场景：目录创建
- **WHEN** 正在创建目标目录
- **THEN** 迁移步骤应设置为 "MKDIR"

#### 场景：文件复制
- **WHEN** 正在复制文件
- **THEN** 迁移步骤应设置为 "机器人复制" (Robocopy)

#### 场景：Junction 创建
- **WHEN** 正在创建 junction 链接
- **THEN** 迁移步骤应设置为 "MKLINK"

#### 场景：迁移完成
- **WHEN** 所有迁移操作完成
- **THEN** 迁移步骤应设置为 "完毕" (Completed)

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
系统应定义其他数据模型以支持高级功能。

#### 场景：迁移配置
- **WHEN** 用户配置迁移设置
- **THEN** 系统应使用 MigrationConfig 模型存储首选项
- **AND** 在后续迁移中应用这些设置

#### 场景：终端日志
- **WHEN** 系统事件发生
- **THEN** 系统应创建 TerminalLogEntry 对象来记录详细信息
- **AND** 在终端组件中显示这些日志

#### 场景：磁盘信息
- **WHEN** 扫描磁盘
- **THEN** 系统应创建 DiskInfo 对象来表示磁盘属性
- **AND** 在磁盘选择界面中显示这些信息

#### 场景：AI 分析结果
- **WHEN** 执行 AI 分析
- **THEN** 系统应使用 AiAnalysisResult 模型存储详细分析结果
- **AND** 在分析结果界面中显示这些信息

## 数据结构

### AppStatus
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

### MoveStep
```typescript
enum MoveStep {
  IDLE = "闲置的",
  MKDIR = "MKDIR",
  ROBOCOPY = "机器人复制",
  MKLINK = "MKLINK",
  COMPLETED = "完毕",
  VERIFYING = "验证",
  CLEANING = "清理"
}
```

### AppFolder
```typescript
interface AppFolder {
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
  errorMessage?: string; // 错误信息
  lastModified?: string; // 最后修改时间
  backupPath?: string; // 备份路径
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

### TerminalLogEntry
```typescript
interface TerminalLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'command';
}
```

### DiskInfo
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

## 实现注意事项

### Tauri 兼容性
- 所有数据结构应设计为可在 Tauri 环境中无缝使用
- 考虑 Rust 和 JavaScript/TypeScript 之间的数据类型转换
- 确保数据结构可序列化和反序列化，以便在前后端之间传递

### 性能考虑
- 对于大型应用程序列表，考虑使用分页或虚拟滚动
- 避免在数据结构中存储过大的二进制数据
- 合理使用可选字段，减少不必要的数据传输

### 扩展性
- 设计数据结构时考虑未来功能扩展
- 使用接口和类型别名提高代码可维护性
- 保持数据结构的一致性和清晰性