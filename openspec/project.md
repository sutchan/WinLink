# Project Context

## 项目概述

**WinLink** 是一款用于管理和迁移 Windows 应用程序文件夹的工具。它会扫描系统盘（通常是 C 盘）上的应用程序安装目录，对每个文件夹进行安全性分析，并引导用户将其迁移到其它磁盘，再通过 NTFS Junction 链接保持原始访问路径，从而释放系统盘空间。

本仓库当前为 **Web 前端原型**：界面与交互流程完整，迁移与文件操作以模拟方式实现，用于验证产品形态。尚未接入真实的文件系统命令（robocopy / mklink）或原生桌面能力。

## 技术栈

- **构建工具**：Vite 5
- **框架**：React 18 + TypeScript 5（`strict` 模式）
- **样式**：Tailwind CSS 3 + PostCSS
- **包管理**：Bun（`bun.lock`）
- **语言**：TypeScript

> 项目规划中的桌面形态可能基于 Tauri 提供原生文件系统能力，但当前代码为纯 Web 应用，未包含任何 Tauri 依赖或配置。

## 项目结构

```
src/
├── main.tsx          # 应用入口
├── App.tsx           # 根组件，负责向导编排与状态管理
├── translations.ts   # 中英文翻译键定义
├── index.css         # 全局样式（Tailwind 指令）
├── vite-env.d.ts     # Vite 类型声明
├── components/       # UI 组件
│   ├── AppList.tsx           # 应用文件夹列表与操作入口
│   ├── DriveSelector.tsx     # 系统盘 / 目标盘选择
│   ├── LanguageToggle.tsx    # 中英文切换
│   ├── ProgressBar.tsx       # 通用进度条
│   ├── MigrationModal.tsx    # 迁移进度弹窗
│   ├── ResultModal.tsx       # 分析结果弹窗
│   └── WizardStep*.tsx       # 向导各步骤组件
├── constants/        # 默认配置与应用常量
│   └── index.ts              # 默认迁移配置、风险等级阈值等
├── features/         # 功能模块（按场景聚合的复合逻辑）
│   ├── fileSelection/        # 文件 / 文件夹选择相关逻辑与组件
│   └── migration/            # 迁移向导相关逻辑与组件
├── services/         # 业务服务层（与 UI 解耦的纯逻辑）
│   ├── geminiService.ts      # 文件夹安全性分析（离线本地规则实现）
│   ├── migrationService.ts   # 迁移流程编排（当前为模拟实现）
│   └── analysisHistoryService.ts # 分析结果缓存与历史管理
├── types/            # TypeScript 类型定义（AppFolder、迁移配置、分析结果等）
└── utils/            # 工具函数（格式化、日志、本地存储等）
```

## 架构约定

- **UI 与逻辑分离**：`components/` 仅负责渲染与交互；`services/` 承载业务流程；`features/` 用于聚合跨组件的场景逻辑。
- **国际化**：所有用户可见文案通过 `translations.ts` 中的翻译键引用，避免硬编码。
- **类型优先**：核心领域模型（应用文件夹、迁移配置、分析结果、迁移步骤）统一在 `types/` 定义，跨模块复用。
- **默认配置集中**：迁移默认参数（如并行执行、迁移后验证、跳过确认）存放于 `constants/index.ts`。

## 关键实现说明

### 安全性分析（services/geminiService.ts）

- 当前为**离线、基于本地规则**的分析，不依赖任何外部 AI 服务或 API Key。
- `getOfflineAnalysis(folderPath, folderName)` 依据路径关键字判定风险：
  - 命中系统关键目录（`Windows`、`System32`、`SysWOW64`、`Program Files`、`AppData\...\Microsoft` 等）→ 风险 **高**，不建议迁移。
  - 命中高危关键字（`system`、`windows`、`microsoft`、`service`、`driver`）→ 风险 **高**。
  - 命中中危关键字（`program`、`appdata`、`local`、`roaming`）→ 风险 **中**，迁移前需备份。
  - 其余 → 风险 **低**，可安全迁移。
- `analyzeFolderSafety` 会先查分析历史缓存（可关闭），再回退到离线分析，并写入历史。
- 风险等级映射安全评分：低=90、中=60、高=30，默认 70。

### 迁移流程（services/migrationService.ts）

- 当前为**模拟实现**：各步骤通过 `simulateOperation` 延时模拟，并不真正执行磁盘读写或系统命令。
- 流程步骤（`MoveStep` 枚举）：`IDLE → MKDIR → ROBOCOPY → MKLINK →（VERIFYING）→ COMPLETED`；回滚流程为 `CLEANING`。
- 支持单个迁移、批量串行 / 并行迁移、取消（`AbortController`）、回滚。
- 暂停 / 恢复接口当前返回 `false`，标记暂不支持。

## 开发规范

- TypeScript 开启 `strict`，尽量避免 `any`。
- 关键逻辑添加中文注释。
- 提交信息遵循 `<type>: <description>`（见仓库根目录 `README.md`）。
- 代码文件行数超过 200 行时按职责拆分为更小模块。

## 版本管理

- 采用 SemVer；文档与代码修改需同步升级最小版本号。
- 版本单一来源：`package.json` 的 `version` 字段、仓库根 `README.md` 徽章、`changes/CHANGELOG.md`。
