# Migration Specification

## Overview
The migration feature is responsible for moving application data from the system disk to another partition and creating junction links to maintain path accessibility. It handles the entire migration process, including directory creation, file copying, and junction link creation.

## Requirements

### Requirement: Migration Process
The system SHALL execute a series of steps to migrate application data and create junction links.

#### Scenario: Migration Initiation
- **WHEN** the user starts the migration process
- **THEN** the system SHALL change the application status to "移动" (Moving)
- **AND** begin executing the migration steps

#### Scenario: Directory Creation
- **WHEN** the migration process starts
- **THEN** the system SHALL create the target directory if it doesn't exist
- **AND** update the migration step to "MKDIR"

#### Scenario: File Copying
- **WHEN** the directory is created
- **THEN** the system SHALL copy the file data using robocopy
- **AND** update the migration step to "机器人复制" (Robocopy)

#### Scenario: Junction Creation
- **WHEN** file copying is complete
- **THEN** the system SHALL create a junction link using mklink
- **AND** update the migration step to "MKLINK"

#### Scenario: Migration Completion
- **WHEN** all steps are complete
- **THEN** the system SHALL change the application status to "已移动" (Moved)
- **AND** update the migration step to "完毕" (Completed)

### Requirement: Command Execution
The system SHALL execute the appropriate Windows commands for each migration step.

#### Scenario: MkDir Command
- **WHEN** creating the target directory
- **THEN** the system SHALL execute `mkdir "Target\Path"`
- **AND** log the command in the terminal

#### Scenario: Robocopy Command
- **WHEN** copying files
- **THEN** the system SHALL execute `robocopy "源" "目标" /E /COPYALL /MOVE`
- **AND** log the command in the terminal

#### Scenario: MkLink Command
- **WHEN** creating the junction link
- **THEN** the system SHALL execute `mklink /J "源" "目标"`
- **AND** log the command in the terminal

### Requirement: Enhanced Migration Features
The system SHALL provide enhanced migration capabilities to improve user experience and reliability.

#### Scenario: Resume Migration
- **WHEN** the migration process is interrupted
- **THEN** the system SHALL allow resuming the migration from the point of interruption
- **AND** display the current progress

#### Scenario: Parallel Migration
- **WHEN** multiple applications are selected
- **THEN** the system SHALL allow simultaneous migration of multiple applications
- **AND** display progress for each

#### Scenario: Migration Rollback
- **WHEN** an error occurs during migration
- **THEN** the system SHALL automatically roll back to the original state
- **AND** display an error message

#### Scenario: Pre-Migration Check
- **WHEN** the user initiates migration
- **THEN** the system SHALL check target disk space and permissions
- **AND** abort with an error if checks fail

#### Scenario: Migration Plan
- **WHEN** the user configures migration settings
- **THEN** the system SHALL allow creating and saving migration plans
- **AND** executing them later

#### Scenario: Incremental Migration
- **WHEN** migrating an application that was previously migrated
- **THEN** the system SHALL only migrate modified files
- **AND** skip unchanged files

## Data Structures

### MigrationConfig
```typescript
interface MigrationConfig {
  overwriteExisting: boolean;
  createBackup: boolean;
  verifyAfterMove: boolean;
  parallelExecution: boolean;
}
```

### AppFolder (with migration fields)
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

## Implementation Notes

### Web POC vs Native Implementation
- In the web POC, the system simulates Windows commands with timeouts
- In native implementations (Electron/Tauri), the system shall execute real Windows commands

### Command Execution
- For Electron: Use `child_process.spawn` to execute commands
- For Tauri: Use the `command` API to execute commands
- Both implementations need to handle UAC (administrator privileges) for mklink

### Performance Considerations
- File copying can be time-consuming, so the implementation should:
  - Use asynchronous operations
  - Display progress updates
  - Consider using multi-threading for large migrations

### Error Handling
- The system should handle various error scenarios:
  - Insufficient disk space
  - Permission denied errors
  - File locking issues
  - Network drive disconnections

### Safety Considerations
- Always create backups before modifying system files
- Implement rollback mechanisms for error recovery
- Verify data integrity after migration

### Testing Considerations
- Test with various application sizes and types
- Test error recovery scenarios
- Test on different Windows versions