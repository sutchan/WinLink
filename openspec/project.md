# 项目上下文

## 项目目的
WinLink Migrator 是一个 Windows 实用工具仪表盘，旨在帮助用户将应用程序数据从系统盘（C盘）迁移到其他分区，并通过创建符号链接（Symbolic Links / Junctions）保持原有路径的访问性。项目集成 Google Gemini AI，用于评估迁移操作的安全性。

## 技术栈
- 前端: React 19, TypeScript, Tailwind CSS
- 图标: Lucide React
- AI 服务: Google GenAI SDK (@google/genai - Gemini 1.5)
- 构建/运行环境: 浏览器 (当前), 目标为 Tauri

## 项目约定

### 代码风格
- TypeScript 严格类型检查
- ESLint 和 Prettier 代码格式化
- 生成代码的函数级注释
- 文件头部注释包含文件名、版本和更新日期

### 架构模式
- React 组件化架构
- 外部集成的服务导向设计
- 使用 Context API 进行状态管理（可扩展到 Zustand/Redux）
- 基于功能的模块化目录结构

### 测试策略
- 核心功能的单元测试
- 迁移工作流的集成测试
- 关键用户旅程的端到端测试
- 测试覆盖率目标: 80%

### Git 工作流
- 主分支用于稳定发布
- 开发分支用于持续开发
- 特性分支用于新功能
- 修复分支用于 bug 修复
- 语义化提交消息: <类型>: <描述>

## 领域上下文
- Windows 文件系统操作 (robocopy, mklink)
- 符号链接和 Junction
- 磁盘空间管理
- AI 辅助安全分析
- 应用程序数据迁移

## 重要约束
- 创建 Junction 需要管理员权限
- 受限于 Windows 文件系统权限
- AI 分析需要网络连接
- 大型文件迁移的性能考虑

## 外部依赖
- Google Gemini AI API 用于安全分析
- Windows 命令提示符用于文件操作
- Tauri 用于原生功能