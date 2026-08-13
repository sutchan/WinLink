# AI 分析规范

## 描述
安全分析功能对应用程序文件夹进行**离线、基于本地规则**的风险评估，帮助用户判断哪些应用适合迁移。当前版本不依赖任何外部 AI 服务或 API 密钥；实现位于 `src/services/geminiService.ts` 的 `getOfflineAnalysis`，名为 "gemini" 仅为历史命名，实际为本地规则引擎。

> 注意：未来若引入在线模型，需通过构建期环境变量（如 `VITE_*`）注入 API 地址/密钥，并补充对应集成规范。当前未实现。

## 需求
### 需求：安全分析
系统应使用本地规则分析应用程序文件夹的迁移安全性。
#### 场景：分析启动
- **WHEN** 用户点击 "Analyze Safety"
- **THEN** 系统应对选定文件夹执行离线规则分析
- **AND** 显示分析状态（Analyzing）

#### 场景：分析通知
- **WHEN** 分析完成
- **THEN** 系统应给出风险等级、安全评分、建议与警告
- **AND** 标注是否命中系统关键路径（如 Windows、System32、系统服务）

#### 场景：分析结果
- **WHEN** 分析完成
- **THEN** 系统应显示安全评估并更新应用状态（含 safetyScore / aiAnalysis）
### 需求：风险等级判定
系统应依据路径关键字判定风险等级。
#### 场景：高风险
- **WHEN** 路径命中系统关键目录或高危关键字（windows/system/microsoft/service/driver）
- **THEN** 系统应判定为 "high" 风险，不建议迁移

#### 场景：中风险
- **WHEN** 路径命中中危关键字（program/appdata/local/roaming）
- **THEN** 系统应判定为 "medium" 风险，迁移前需备份

#### 场景：低风险
- **WHEN** 路径未命中上述关键字
- **THEN** 系统应判定为 "low" 风险，可安全迁移
### 需求：错误处理
当分析过程异常时，系统应优雅处理。
#### 场景：分析异常
- **WHEN** 分析过程抛出异常
- **THEN** 系统应返回默认的 "medium" 风险评估
- **AND** 显示相应的错误消息
### 需求：增强分析功能
系统应提供增强的分析功能，以提高用户体验和效率。
#### 场景：批量分析
- **WHEN** 用户选择多个应用程序
- **THEN** 系统应支持同时分析所有选定的应用程序
- **AND** 通过进度回调显示每个应用的进度

#### 场景：分析历史
- **WHEN** 执行分析
- **THEN** 系统应缓存分析结果（analysisHistoryService）
- **AND** 重复分析同一文件夹时优先命中缓存（可关闭）

## 数据结构

### AnalysisResult（当前实现，对应 src/types AiAnalysisResult）
```typescript
interface AiAnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  recommendations: string[];
  warnings: string[];
  safeToMove: boolean;
  // 注：AppFolder 另含 safetyScore (0-100) 与 aiAnalysis 文本建议
}
```

## 实现注意事项

### 本地规则引擎
- 分析在浏览器主线程同步完成，无需网络请求
- 关键字匹配使用小写路径包含判断，命中即提升风险等级
- 风险等级映射到安全评分，供 UI 直观展示

### 性能优化
- 实现分析结果的缓存（analysisHistoryService），避免重复分析同一文件夹
- UI 触发分析时通过进度回调防止界面卡顿

### 安全性
- 分析仅基于文件夹路径与名称，不读取文件内容，不发送任何数据到外部服务
- 未来接入在线模型时需确保密钥不暴露在前端代码中