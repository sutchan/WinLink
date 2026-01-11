# AI 分析规范

## 概述
AI 分析功能利用 Google Gemini AI 评估迁移应用程序数据的安全性。它为用户提供风险评估和建议，帮助他们就迁移哪些应用程序做出明智的决策。

## 需求

### 需求：AI 安全分析
系统应使用 Google Gemini AI 分析迁移应用程序数据的安全性。

#### 场景：分析启动
- **WHEN** 用户点击 "Analyze Safety"
- **THEN** 系统应将应用程序文件夹信息发送到 AI 服务
- **AND** 显示分析状态

#### 场景：分析提示
- **WHEN** 向 AI 发送数据
- **THEN** 系统应包含询问硬编码路径、系统服务和适合 junction 链接的提示

#### 场景：分析结果
- **WHEN** AI 分析完成
- **THEN** 系统应显示安全评分和分析结果
- **AND** 相应更新应用程序状态

### 需求：输出格式标准化
系统应强制 AI 分析结果使用一致的 JSON 架构。

#### 场景：JSON 架构输出
- **WHEN** 请求 AI 分析
- **THEN** 系统应在提示中指定 JSON 架构
- **AND** 期望 AI 以该格式返回结果

#### 场景：结果解析
- **WHEN** 接收 AI 结果
- **THEN** 系统应解析 JSON 响应
- **AND** 提取风险级别和建议

### 需求：错误处理
当 AI 分析失败时，系统应优雅地处理错误。

#### 场景：API 密钥缺失
- **WHEN** AI 服务 API 密钥缺失
- **THEN** 系统应返回默认的 "Medium Risk" 评估
- **AND** 显示适当的错误消息

#### 场景：请求失败
- **WHEN** AI 服务请求失败
- **THEN** 系统应返回默认的 "Medium Risk" 评估
- **AND** 显示适当的错误消息

### 需求：增强 AI 分析功能
系统应提供增强的 AI 分析功能，以提高用户体验和效率。

#### 场景：批量分析
- **WHEN** 用户选择多个应用程序
- **THEN** 系统应允许同时分析所有选定的应用程序
- **AND** 显示每个应用程序的进度

#### 场景：分析历史
- **WHEN** 执行 AI 分析
- **THEN** 系统应保存分析结果
- **AND** 允许用户查看历史分析

#### 场景：离线分析模式
- **WHEN** 无网络连接可用
- **THEN** 系统应使用基于本地规则的分析
- **AND** 显示有关有限分析功能的说明

#### 场景：分析深度选择
- **WHEN** 启动分析
- **THEN** 系统应允许用户选择分析深度（快速/标准/深度）
- **AND** 相应调整分析过程

#### 场景：自定义提示配置
- **WHEN** 高级用户配置设置
- **THEN** 系统应允许自定义 AI 分析提示
- **AND** 对后续分析使用自定义提示

## 数据结构

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

### AppFolder (带 AI 字段)
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

## 实现注意事项

### Tauri 兼容性
- 在 Tauri 环境中使用 Google GenAI SDK
- 考虑在 Rust 后端处理 AI 请求，以提高安全性
- 确保 API 密钥的安全存储和管理

### API 集成
- 系统使用 Google GenAI SDK (@google/genai) 与 Gemini 1.5 交互
- API 密钥应安全存储，不在生产环境中硬编码

### 提示工程
- 提示应精心设计以引出最相关的信息
- 应包含有关影响迁移安全性的应用程序特性的具体问题

### 性能考虑
- AI 分析可能耗时，因此实现应：
  - 使用异步操作
  - 显示进度指示器
  - 考虑缓存频繁分析的应用程序结果

### 隐私考虑
- 系统应透明地向用户说明发送给 AI 服务的数据
- 用户应了解并同意数据共享以进行分析