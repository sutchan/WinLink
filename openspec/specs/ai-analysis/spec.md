# AI Analysis Specification

## Overview
The AI analysis feature leverages Google Gemini AI to assess the safety of migrating application data. It provides users with risk assessments and recommendations to help them make informed decisions about which applications to migrate.

## Requirements

### Requirement: AI Safety Analysis
The system SHALL use Google Gemini AI to analyze the safety of migrating application data.

#### Scenario: Analysis Initiation
- **WHEN** the user clicks "Analyze Safety"
- **THEN** the system SHALL send the application folder information to the AI service
- **AND** display an analyzing status

#### Scenario: Analysis Prompt
- **WHEN** sending data to the AI
- **THEN** the system SHALL include a prompt asking about hardcoded paths, system services, and suitability for junction links

#### Scenario: Analysis Results
- **WHEN** the AI analysis is complete
- **THEN** the system SHALL display the safety score and analysis results
- **AND** update the application status accordingly

### Requirement: Output Format Standardization
The system SHALL enforce a consistent JSON schema for AI analysis results.

#### Scenario: JSON Schema Output
- **WHEN** requesting AI analysis
- **THEN** the system SHALL specify a JSON schema in the prompt
- **AND** expect the AI to return results in that format

#### Scenario: Result Parsing
- **WHEN** receiving AI results
- **THEN** the system SHALL parse the JSON response
- **AND** extract risk level and recommendations

### Requirement: Error Handling
The system SHALL handle errors gracefully when AI analysis fails.

#### Scenario: API Key Missing
- **WHEN** the AI service API key is missing
- **THEN** the system SHALL return a default "Medium Risk" assessment
- **AND** display an appropriate error message

#### Scenario: Request Failure
- **WHEN** the AI service request fails
- **THEN** the system SHALL return a default "Medium Risk" assessment
- **AND** display an appropriate error message

### Requirement: Enhanced AI Analysis Features
The system SHALL provide enhanced AI analysis capabilities to improve user experience and efficiency.

#### Scenario: Batch Analysis
- **WHEN** the user selects multiple applications
- **THEN** the system SHALL allow simultaneous analysis of all selected applications
- **AND** display progress for each

#### Scenario: Analysis History
- **WHEN** AI analysis is performed
- **THEN** the system SHALL save the analysis results
- **AND** allow users to view historical analyses

#### Scenario: Offline Analysis Mode
- **WHEN** no network connection is available
- **THEN** the system SHALL use a local rule-based analysis
- **AND** display a note about limited analysis capabilities

#### Scenario: Analysis Depth Selection
- **WHEN** initiating analysis
- **THEN** the system SHALL allow users to select analysis depth (fast/standard/deep)
- **AND** adjust the analysis process accordingly

#### Scenario: Custom Prompt Configuration
- **WHEN** advanced users configure settings
- **THEN** the system SHALL allow customization of AI analysis prompts
- **AND** use the custom prompt for subsequent analyses

## Data Structures

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

### AppFolder (with AI fields)
```typescript
interface AppFolder {
  id: string;
  name: string;
  sourcePath: string;
  size: string;
  status: AppStatus;
  safetyScore?: number; // AI 评分 (0-100)
  aiAnalysis?: string;  // AI 分析建议
  aiAnalysisResult?: AiAnalysisResult; // 详细分析结果
}
```

## Implementation Notes

### API Integration
- The system uses the Google GenAI SDK (@google/genai) to interact with Gemini 1.5
- API keys should be stored securely and not hardcoded in production

### Prompt Engineering
- The prompt should be carefully crafted to elicit the most relevant information
- It should include specific questions about application characteristics that affect migration safety

### Performance Considerations
- AI analysis can be time-consuming, so the implementation should:
  - Use asynchronous operations
  - Display progress indicators
  - Consider caching results for frequently analyzed applications

### Privacy Considerations
- The system should be transparent about what data is sent to the AI service
- Users should be informed and consent to data sharing for analysis purposes