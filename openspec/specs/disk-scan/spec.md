# Disk Scan Specification

## Overview
The disk scan feature is responsible for detecting and analyzing disks and applications on the system. It provides the foundation for all other features by identifying potential migration candidates and gathering necessary information about disk usage and application data.

## Requirements

### Requirement: Disk Detection
The system SHALL detect all available disks on the system and display them to the user.

#### Scenario: System Startup
- **WHEN** the application starts
- **THEN** the system SHALL scan for all available disks
- **AND** display them in the disk selection interface

#### Scenario: Disk Selection Change
- **WHEN** the user selects a different disk
- **THEN** the system SHALL trigger a new scan for applications on that disk
- **AND** reset the selected application status

### Requirement: Application Scanning
The system SHALL scan the selected disk for applications and their associated data folders.

#### Scenario: Application Detection
- **WHEN** a disk is selected
- **THEN** the system SHALL scan the disk for application data folders
- **AND** display them in the application list

#### Scenario: Scan Animation
- **WHEN** a disk scan is in progress
- **THEN** the system SHALL display a scan animation to indicate activity

### Requirement: Application Information Gathering
The system SHALL gather and display relevant information about each detected application.

#### Scenario: Application Details
- **WHEN** an application is detected
- **THEN** the system SHALL collect information including name, size, and path
- **AND** display this information in the application card

#### Scenario: Disk Space Calculation
- **WHEN** scanning is complete
- **THEN** the system SHALL calculate and display total disk usage
- **AND** available free space

### Requirement: Enhanced Scanning Features
The system SHALL provide enhanced scanning capabilities to improve user experience and efficiency.

#### Scenario: Intelligent Sorting
- **WHEN** applications are displayed
- **THEN** the system SHALL allow sorting by size, name, or type

#### Scenario: Filtering Options
- **WHEN** the user applies filters
- **THEN** the system SHALL display only applications matching the filter criteria
- **AND** update the display accordingly

#### Scenario: File Type Analysis
- **WHEN** scanning applications
- **THEN** the system SHALL analyze file types within each application folder
- **AND** display the distribution of file types

#### Scenario: Disk Space Warning
- **WHEN** disk space is low
- **THEN** the system SHALL display a warning to the user
- **AND** suggest appropriate actions

#### Scenario: Scan Progress Indication
- **WHEN** scanning large disks
- **THEN** the system SHALL display a progress bar indicating scan completion percentage

## Data Structures

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

### AppFolder
```typescript
interface AppFolder {
  id: string;
  name: string;
  sourcePath: string;
  size: string;
  status: AppStatus;
  fileTypes?: Record<string, number>; // 文件类型分布
}
```

## Implementation Notes

### Scanning Performance
- Scanning large disks can be time-consuming, so the implementation should:
  - Use asynchronous operations to avoid blocking the UI
  - Implement caching to avoid repeated scans
  - Provide progress updates for better user feedback

### Mock Data
- For web POC purposes, the system uses mock data from constants.ts
- In production, this should be replaced with real disk scanning using Node.js fs module or Tauri Rust backend

### Error Handling
- The system should handle various error scenarios during scanning:
  - Access denied errors
  - Disk not ready errors
  - Network drive timeouts
  - Provide clear error messages to the user