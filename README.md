# WinLink Migrator

<p align="center">
  <img src="https://neeko-copilot.bytedance.net/api/text2image?prompt=Windows%20utility%20dashboard%20for%20migrating%20application%20data%20with%20dark%20mode%20interface%2C%20blue%20accents%2C%20modern%20UI&size=1024x512" alt="WinLink Migrator Dashboard" width="600" />
</p>

## 📋 项目简介

WinLink Migrator 是一个 Windows 实用工具仪表盘，旨在帮助用户将应用程序数据从系统盘（C盘）迁移到其他分区，并通过创建符号链接（Symbolic Links / Junctions）保持原有路径的访问性。

### 核心功能

- 📁 **智能磁盘扫描** - 自动检测系统盘上的应用程序数据
- 🤖 **AI 安全分析** - 集成 Google Gemini AI 评估迁移安全性
- 🚀 **高效迁移** - 使用 Windows 原生命令进行快速数据迁移
- 🔗 **符号链接** - 创建 Junction 链接保持路径访问性
- 📊 **实时监控** - 提供详细的迁移进度和终端日志
- 🌍 **国际化支持** - 支持中英文界面切换

## 🛠️ 技术栈

- **前端框架**: React 19 + TypeScript
- **样式方案**: Tailwind CSS
- **图标库**: Lucide React
- **AI 服务**: Google GenAI SDK (Gemini 1.5)
- **目标平台**: Tauri (原生应用)

## 📦 快速开始

### 环境要求

- Node.js 18+ 
- npm 9+ 或 pnpm 8+
- Rust (Tauri 依赖)
- Windows 10/11 操作系统

### 安装与运行

1. **克隆仓库**

```bash
git clone https://github.com/sutchan/WinLink.git
cd WinLink
```

2. **安装依赖**

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

3. **启动开发服务器**

```bash
# 使用 npm
npm run dev

# 或使用 pnpm
pnpm dev
```

4. **构建生产版本**

```bash
# 使用 npm
npm run build

# 或使用 pnpm
pnpm build
```

## 🖥️ 使用方法

### 基本迁移流程

1. **选择源磁盘** - 从下拉菜单中选择要扫描的源磁盘（通常是 C 盘）
2. **分析应用** - 系统会自动扫描并显示可迁移的应用程序
3. **安全分析** - 点击 "Analyze Safety" 按钮让 AI 评估迁移安全性
4. **选择目标** - 选择要迁移到的目标分区
5. **开始迁移** - 点击 "Move" 按钮开始迁移过程
6. **监控进度** - 查看实时迁移进度和终端日志

### 高级功能

- **批量操作** - 支持同时分析和迁移多个应用
- **迁移计划** - 创建和保存迁移计划以便后续执行
- **增量迁移** - 只迁移修改过的文件，节省时间
- **错误恢复** - 在迁移失败时自动回滚到原始状态

## 📁 项目结构

```
WinLink/
├── public/             # 静态资源
├── src/
│   ├── components/     # React 组件
│   ├── services/       # 服务（如 AI 集成）
│   ├── types/          # TypeScript 类型定义
│   ├── App.tsx         # 主应用组件
│   └── index.tsx       # 应用入口
├── src-tauri/          # Tauri 后端代码
│   ├── src/            # Rust 源代码
│   └── Cargo.toml      # Rust 依赖配置
├── openspec/           # 项目规范文档
├── tests/              # 测试文件
├── package.json        # 项目配置
└── README.md           # 项目说明
```

## 🔒 安全性

- **AI 安全评估** - 迁移前使用 Gemini AI 分析潜在风险
- **权限管理** - 智能处理 Windows 权限问题
- **数据完整性** - 迁移后验证文件完整性
- **错误处理** - 完善的错误处理和回滚机制

## 🤝 贡献指南

我们欢迎社区贡献！请按照以下步骤参与：

1. **Fork 仓库**
2. **创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **打开 Pull Request**

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🌟 特别鸣谢

- [React](https://react.dev/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式方案
- [Google Gemini](https://gemini.google.com/) - AI 安全分析
- [Lucide](https://lucide.dev/) - 图标库
- [Tauri](https://tauri.app/) - 桌面应用框架

## 📞 联系方式

- **项目链接**: [https://github.com/sutchan/WinLink](https://github.com/sutchan/WinLink)
- **作者**: Sut

---

<p align="center">
  <a href="https://github.com/sutchan/WinLink" target="_blank">
    <img src="https://img.shields.io/github/stars/sutchan/WinLink?style=social" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/sutchan/WinLink/fork" target="_blank">
    <img src="https://img.shields.io/github/forks/sutchan/WinLink?style=social" alt="GitHub Forks" />
  </a>
</p>