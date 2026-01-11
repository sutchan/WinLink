# Core Models Specification

## Overview
Core data models define the fundamental data structures and state management for the WinLink Migrator application. These models are used across all features to represent application state, migration progress, and user data.

## Requirements

### Requirement: Application Status Management
The system SHALL define a set of application statuses to track the migration process.

#### Scenario: Initial Application Load
- **WHEN** the application is first loaded
- **THEN** all applications SHALL be in the "准备好" (Ready) status

#### Scenario: AI Analysis Initiated
- **WHEN** the user initiates AI safety analysis
- **THEN** the application status SHALL change to "分析" (Analyzing)

#### Scenario: Migration Initiated
- **WHEN** the user starts the migration process
- **THEN** the application status SHALL change to "移动" (Moving)

#### Scenario: Migration Completed
- **WHEN** the migration process finishes successfully
- **THEN** the application status SHALL change to "已移动" (Moved)

#### Scenario: Error Occurred
- **WHEN** an error occurs during any process
- **THEN** the application status SHALL change to "错误" (Error)

### Requirement: Migration Step Tracking
The system SHALL define a set of migration steps to track the detailed progress of the migration process.

#### Scenario: Migration Started
- **WHEN** migration begins
- **THEN** the migration step SHALL be set to "闲置的" (Idle)

#### Scenario: Directory Creation
- **WHEN** the target directory is being created
- **THEN** the migration step SHALL be set to "MKDIR"

#### Scenario: File Copying
- **WHEN** files are being copied
- **THEN** the migration step SHALL be set to "机器人复制" (Robocopy)

#### Scenario: Junction Creation
- **WHEN** the junction link is being created
- **THEN** the migration step SHALL be set to "MKLINK"

#### Scenario: Migration Completed
- **WHEN** all migration operations are complete
- **THEN** the migration step SHALL be set to "完毕" (Completed)

### Requirement: Application Folder Data Structure
The system SHALL define a data structure to represent application folders for migration.

#### Scenario: Folder Data Representation
- **WHEN** an application folder is scanned
- **THEN** the system SHALL create an AppFolder object with id, name, sourcePath, size, status, and optional fields

#### Scenario: AI Analysis Results
- **WHEN** AI analysis is completed
- **THEN** the system SHALL update the AppFolder object with safetyScore and aiAnalysis fields

#### Scenario: Migration Progress
- **WHEN** migration is in progress
- **THEN** the system SHALL update the AppFolder object with moveStep and progress fields

### Requirement: Extended Data Models
The system SHALL define additional data models to support advanced functionality.

#### Scenario: Migration Configuration
- **WHEN** the user configures migration settings
- **THEN** the system SHALL use the MigrationConfig model to store preferences

#### Scenario: Terminal Logging
- **WHEN** system events occur
- **THEN** the system SHALL create TerminalLogEntry objects to record details

#### Scenario: Disk Information
- **WHEN** disks are scanned
- **THEN** the system SHALL create DiskInfo objects to represent disk properties

#### Scenario: AI Analysis Results
- **WHEN** AI analysis is performed
- **THEN** the system SHALL use the AiAnalysisResult model to store detailed analysis results

## Data Structures

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