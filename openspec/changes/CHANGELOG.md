# 变更日志

## 版本 0.1.3 (2026-08-13)

### 文档对齐（规范与代码一致）
- 修正 `specs/ai-analysis/spec.md`：删除虚构的 Google Gemini AI / API Key / HTTP 调用，改为实际的离线本地规则分析（`getOfflineAnalysis`），数据结构对齐 `AiAnalysisResult.safeToMove`
- 修正 `specs/migration/spec.md`：删除"子进程执行 robocopy/mklink / 防命令注入"虚构，标注当前为模拟实现（`simulateOperation`），真实命令执行列为目标行为
- 修正 `specs/internationalization/spec.md`：删除 i18next/JSON 翻译目录方案，对齐实际的 `src/translations.ts` 单文件（zh/en 对象）
- 修正 `specs/terminal/spec.md`：删除 Tauri 兼容虚构，标注终端日志 UI 尚未实现
- 修正 `specs/testing/spec.md`：删除未实现的 diskService/logService/themeService、主题测试与 80% 覆盖率虚构；标注当前仅 package.json 声明 test 脚本但无测试文件
- 修正 `specs/ui-ux/spec.md`：删除深色模式/自定义 Windows 标题栏/主题切换/多窗口/托盘等虚构，标注实际为浅色 Web 应用
- 修正 `specs/deployment/spec.md`：删除 VITE_GEMINI_API_KEY、Tauri 构建/自动更新、未定义脚本（build:dev 等）虚构，标注 Tauri 为未来目标，依赖锁定改为 bun.lock
- 修正 `specs/core-models/spec.md`：数据结构对齐 `src/types/index.ts`（AppStatus/MoveStep 枚举、MigrationConfig、AiAnalysisResult），标注 TerminalLogEntry/DiskInfo 为规划类型
- 修正 `specs/disk-scan/spec.md`：标注扫描动画/文件类型分析/磁盘空间警告等为规划目标
- 统一产品显示名：代码 `index.html`/`App.tsx`/`translations.ts`/`translations/en.json`/`utils/constants.ts` 中 "WinLink Migrator" 全部改为 "WinLink"，`appConfig.version` 同步至 0.1.3
- 同步版本号至 package.json、README 徽章与本文档

### 说明
- 产品名现已统一为 "WinLink"（此前 UI 显示名与仓库名不一致，本次对齐）

## 版本 0.1.2 (2026-08-13)

### 文档补充
- 新增根目录 `LICENSE`（MIT），README 许可证说明改为指向实际文件
- 新增 `docs/开发指南.md`：环境准备、安装运行、项目约定、提交与版本管理、贡献流程
- 新增 `docs/架构说明.md`：分层架构图、各层职责、分析/迁移数据流、国际化与状态管理
- 补充缺失的 `openspec/guidelines/ai-rules.md`：AI 助手规则（提炼自根目录 AGENTS.md）
- 修正 `openspec/README.md`：目录结构与 `guidelines/` 引用对齐真实情况（specs 按功能分目录、guidelines 仅含 style-guide.md）
- 同步版本号至 package.json、README 徽章与本文档

### 说明
- 当前为 Web 前端原型，迁移与文件操作仍为模拟实现；真实文件系统命令与原生能力为未来演进

## 版本 0.1.1 (2026-08-13)

### 文档完善
- 修正 README.md：统一项目名称为 WinLink，明确当前为 Web 前端原型（迁移/文件操作为模拟实现）
- 修正 README.md：移除虚构的 Gemini API 集成与 Tauri 技术栈描述，补充真实的快速开始、项目结构与工作原理
- 修正 openspec/project.md：将「AI 安全分析」对齐为离线本地规则分析（非 Gemini API），迁移服务标注为模拟实现
- 修正 openspec/project.md：移除不存在的服务（diskService/themeService/logService/terminalService）与主题切换描述
- 修正 openspec/README.md：统一标题为「WinLink 项目文档」
- 同步版本号至 package.json 与 README 徽章

### 说明
- 此前 0.1.0 变更记录中部分条目（如 Gemini AI 集成、Tauri 迁移、Vitest 测试、主题切换、终端日志）与实际代码不符，已在本文档中更正，以源码为准

## 版本 0.1.0 (2026-01-12)

### 主要功能
- 实现了 WinLink 核心功能，用于管理和迁移 Windows 应用程序文件夹（扫描系统盘应用目录、安全性分析、迁移向导）
- 基于本地规则的离线安全性分析，对应用文件夹给出风险等级、安全评分与迁移建议
- 应用程序文件夹列表展示（名称、路径、大小、状态）
- 迁移向导：选择目标盘、配置迁移参数、执行迁移流程
- 迁移控制：取消进行中的迁移、对已完成迁移执行回滚
- 支持中文和英文国际化
- 分析历史缓存与复用

### 技术实现
- 使用 React 18 + TypeScript（strict 模式）构建前端
- 使用 Tailwind CSS 3 + PostCSS 实现样式
- 使用 Vite 5 作为构建工具
- 使用 Bun 管理依赖（bun.lock）
- 采用「组件 / 服务 / 功能 / 类型 / 工具」分层的架构模式
- 界面上下文状态在根组件（App.tsx）中管理

### 目录结构
- `src/components/`: React 组件（应用列表、向导步骤、弹窗、语言切换等）
- `src/services/`: 服务层（geminiService 离线分析、migrationService 迁移编排、analysisHistoryService 历史）
- `src/constants/`: 默认配置与常量
- `src/features/`: 功能模块（文件选择、迁移向导）
- `src/types/`: TypeScript 类型定义
- `src/utils/`: 工具函数
- `openspec/`: 项目规范与文档

### 核心服务
- `geminiService`: 基于本地规则的离线安全性分析（非外部 AI 服务）
- `migrationService`: 迁移流程编排（当前为模拟实现）
- `analysisHistoryService`: 分析历史管理

### 界面功能
- 系统盘 / 目标盘选择
- 应用程序列表显示
- 应用程序安全性分析（风险等级、评分、建议）
- 单个和批量分析
- 迁移向导与进度展示
- 语言切换

### 状态说明
- 迁移与文件操作目前为模拟流程（simulateOperation），用于验证交互；尚未接入真实文件系统命令或原生桌面能力

## 未来计划
- 接入真实文件系统命令（robocopy / mklink）实现真正的迁移
- 评估引入 Tauri 以提供更强的原生能力（尚未确定）
- 完善测试体系（当前无自动化测试）
- 增强分析能力（如结合在线模型，需配置 API Key）
- 添加应用程序备份和恢复功能
- 支持更多语言的国际化
