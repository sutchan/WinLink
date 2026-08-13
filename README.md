# WinLink

[![Version](https://img.shields.io/badge/version-0.1.3-blue.svg)](https://github.com/your-username/WinLink)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

> Windows 应用程序文件夹迁移管理器 —— 将 C 盘上的应用程序文件夹迁移到其它盘（如 D 盘），并通过 Junction 符号链接保持原路径可访问，从而释放系统盘空间。

WinLink 是一款用于管理和迁移 Windows 应用程序文件夹的 Web 工具。它会对目标文件夹进行**安全性分析**（识别系统关键文件夹、评估迁移风险），并引导用户将文件夹移动到目标磁盘，再以 NTFS Junction 链接还原原始访问路径，避免程序因路径变动而失效。

> 提示：本仓库当前为 **Web 前端原型**。迁移与文件操作目前以模拟方式实现，用于验证交互流程；尚未接入真实的文件系统命令（robocopy / mklink）与原生能力。

## 功能特性

- **应用文件夹扫描**：自动列出 C 盘 `Program Files`、`Program Files (x86)`、`AppData` 等位置的常见应用文件夹，显示名称、路径、大小与状态。
- **安全性分析**：基于本地规则的离线分析，对每个文件夹给出风险等级（低 / 中 / 高）、置信度、安全评分（0–100）以及迁移建议与警告。
- **批量分析**：支持一次分析多个应用文件夹，并通过进度回调实时展示进度。
- **迁移向导**：通过「系统盘 → 目标盘 → 迁移」的多步向导，配置目标路径并触发迁移流程。
- **迁移控制**：支持取消进行中的迁移、对已完成迁移执行回滚，实时展示迁移步骤与进度。
- **国际化**：内置中文 / 英文切换，全部界面文案通过翻译键管理。
- **分析历史**：缓存并复用分析结果，避免重复分析。

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 构建工具 | Vite 5 |
| 前端框架 | React 18 + TypeScript |
| 样式 | Tailwind CSS 3 + PostCSS |
| 语言 | TypeScript 5（`strict` 模式） |
| 包管理 | Bun（`bun.lock`） |

> 说明：项目规划中的桌面形态可能基于 Tauri 提供原生文件系统能力，但当前代码为纯 Web 应用，无 Tauri 依赖。

## 项目结构

```
WinLink/
├── index.html                 # Vite 入口 HTML
├── vite.config.ts             # Vite 构建配置
├── tsconfig.json              # TypeScript 配置
├── tailwind.config.js         # Tailwind CSS 配置
├── postcss.config.js          # PostCSS 配置
├── package.json               # 依赖与脚本
├── openspec/                  # OpenSpec 规范与变更提案
│   ├── project.md             # 项目规范（技术栈、架构、约定）
│   ├── README.md              # OpenSpec 工作流说明
│   ├── changes/               # 变更提案与 CHANGELOG
│   ├── specs/                 # 功能规范（requirements / design / tasks）
│   ├── guidelines/            # 团队指南（编码风格、AI 规则）
│   └── templates/             # 提案与规范模板
└── src/
    ├── main.tsx               # 应用入口
    ├── App.tsx                # 根组件（向导编排）
    ├── index.css              # 全局样式
    ├── translations.ts        # 中英文翻译键
    ├── vite-env.d.ts          # Vite 类型声明
    ├── components/            # UI 组件（AppList、向导步骤、弹窗等）
    ├── constants/             # 默认配置与应用常量
    ├── features/              # 功能模块（文件选择、迁移向导）
    ├── services/              # 业务服务（分析、迁移、历史）
    ├── types/                 # TypeScript 类型定义
    └── utils/                 # 工具函数（格式化、日志、存储等）
```

## 快速开始

### 环境要求

- Node.js 18+ 或 Bun 1.0+
- Windows（目标使用场景；当前 Web 原型可在任意平台运行开发服务器）

### 安装依赖

```bash
# 使用 Bun（推荐，与 bun.lock 对应）
bun install

# 或使用 npm
npm install
```

### 开发模式

```bash
bun dev        # 启动 Vite 开发服务器，默认 http://localhost:5173
# 或
npm run dev
```

### 构建

```bash
bun build      # 类型检查 + 生产构建，产物输出到 dist/
# 或
npm run build
```

### 预览构建产物

```bash
bun preview    # 本地预览 dist/ 构建结果
# 或
npm run preview
```

### 代码检查

```bash
bun lint       # 执行 ESLint 检查
# 或
npm run lint
```

## 工作原理

1. **扫描**：列出系统盘上常见的应用安装目录，归纳为可迁移的「应用文件夹」列表。
2. **分析**：对每个文件夹执行离线安全性分析（`getOfflineAnalysis`），依据路径关键字（如 `Windows`、`System32`、`Microsoft`、服务/驱动等）判定风险等级，并给出安全评分与迁移建议。结果写入分析历史以便复用。
3. **迁移**：迁移向导收集目标盘路径，调用迁移服务执行「创建目标目录 → 复制文件 → 创建 Junction 链接 →（可选）验证」流程，并支持取消与回滚。

> 注意：上述文件操作在当前版本中为**模拟流程**（`simulateOperation`），用于演示交互；尚未真正读写磁盘或执行系统命令。

## 配置

当前 Web 原型无需外部配置文件或环境变量。后续接入真实迁移与原生能力时，可能引入构建期环境变量（如 `VITE_*`）用于配置 API 地址或特性开关，相关说明将在本小节补充。

## 贡献

欢迎通过 Issue 与 Pull Request 参与贡献。

1. Fork 本仓库并创建特性分支（`feature/*`）。
2. 保持 TypeScript `strict` 模式，新增逻辑补充中文注释。
3. 确保 `bun lint` 与 `bun build` 通过。
4. 提交信息遵循 `<type>: <description>` 约定（见下方）。
5. 发起 PR 到 `main` 分支，描述变更内容、动机与测试说明。

### 提交信息约定

```
<type>: <description>   # 如 feat: 添加批量迁移进度展示

type: feat / fix / docs / refactor / style / test / chore / perf
```

## 许可证

本项目采用 MIT 许可证开源，许可证文本见仓库根目录 [`LICENSE`](./LICENSE) 文件。

---

<p align="center">WinLink · 让 Windows 应用迁移更省心</p>
