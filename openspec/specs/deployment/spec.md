# 部署规范

## 描述

部署规范定义了 WinLink Migrator 项目的部署环境配置、发布流程、版本管理和运维策略。它确保应用程序能够在不同环境中稳定运行，并提供清晰的发布流程和版本控制机制。

## 环境配置

### 开发环境

- **操作系统**: Windows 10 或更高版本（目标使用场景）；开发服务器可跨平台运行
- **Node.js**: 18.0 或更高版本（或 Bun 1.0+）
- **包管理器**: Bun（推荐，对应 bun.lock）或 npm
- **IDE**: Visual Studio Code 推荐
- **浏览器**: Chrome、Firefox、Edge

### 测试环境

- **操作系统**: Windows 10 或更高版本
- **Node.js**: 18.0 或更高版本
- **包管理器**: Bun 或 npm

### 生产环境

- **操作系统**: Windows 10 或更高版本
- **Node.js**: 18.0 或更高版本
- **包管理器**: Bun 或 npm

> 说明：当前 Web 原型**无需**外部环境变量（无 `VITE_GEMINI_API_KEY` 等）。未来若接入在线分析模型或真实迁移后端，可引入 `VITE_*` 构建期变量，届时补充此处。

## 构建流程

### 开发构建

```bash
# 开发服务器
bun dev        # 或 npm run dev
```

### 生产构建

```bash
# 生产构建（类型检查 + 打包）
bun build      # 或 npm run build
```

> 说明：当前 `package.json` 仅定义 `dev`、`build`、`preview`、`lint`、`test` 脚本，未定义 `build:dev` / `build:analyze`，相关分析流程待后续补充。

### 构建产物

- **输出目录**: `dist/`
- **静态资源**: `dist/assets/`
- **入口文件**: `dist/index.html`
- **配置文件**: 构建过程中根据环境变量生成

### 构建优化

- **代码分割**: 按路由和组件分割代码
- **树摇**: 移除未使用的代码
- **压缩**: 压缩 JavaScript、CSS 和 HTML
- **缓存**: 为静态资源添加哈希值，优化浏览器缓存

## 发布流程

### 发布准备

1. **代码审查**: 确保所有代码更改已通过代码审查
2. **测试**: 运行完整的测试套件，确保所有测试通过
3. **构建**: 执行生产构建，确保构建成功
4. **版本更新**: 更新版本号，遵循语义化版本规范
5. **变更记录**: 更新 CHANGELOG.md，记录本次发布的变更

### 发布步骤

1. **创建发布分支**: 从 main 分支创建发布分支
2. **执行构建**: 在发布分支上执行生产构建
3. **运行测试**: 在发布分支上运行完整测试套件
4. **更新版本**: 更新 package.json 中的版本号
5. **更新变更记录**: 更新 CHANGELOG.md
6. **提交更改**: 提交版本更新和变更记录
7. **创建标签**: 创建版本标签，格式为 v{版本号}
8. **合并到 main**: 将发布分支合并回 main 分支
9. **推送到远程**: 推送代码和标签到远程仓库
10. **发布发布包**: 在 GitHub 上创建发布，上传构建产物

### 发布类型

- **补丁发布**: 修复 bug，不添加新功能
  - 版本格式: vX.Y.Z
  - 示例: v1.0.1

- ** minor 发布**: 添加新功能，向后兼容
  - 版本格式: vX.Y.0
  - 示例: v1.1.0

- ** major 发布**: 破坏性变更，不向后兼容
  - 版本格式: vX.0.0
  - 示例: v2.0.0

## 版本管理

### 版本控制策略

- **语义化版本**: 遵循语义化版本规范 (SemVer)
- **分支管理**: 
  - main: 稳定发布分支
  - dev: 开发分支
  - feature/*: 特性分支
  - fix/*: 修复分支
  - release/*: 发布分支

### 版本号格式

```
v<major>.<minor>.<patch>
```

- **major**: 主版本号，破坏性变更
- **minor**: 次版本号，新功能
- **patch**: 补丁版本号，bug 修复

### 版本历史

- **CHANGELOG.md**: 记录所有版本的变更历史
- **GitHub Releases**: 在 GitHub 上创建发布，包含发布说明和构建产物
- **Git 标签**: 使用 Git 标签标记每个版本

## 部署策略

### Web 部署

- **静态网站托管**: 可部署到 Vercel、Netlify、GitHub Pages 等
- **CDN 配置**: 启用 CDN 加速静态资源
- **HTTPS 配置**: 确保使用 HTTPS 协议
- **缓存策略**: 配置合理的缓存策略

### Tauri 桌面应用部署（目标，尚未实现）

> 当前为纯 Web 应用，未引入 Tauri。以下为未来若采用 Tauri 提供原生能力的规划。

- **构建目标**: 
  - Windows (x64)
  - Windows (arm64)

- **构建命令**（需引入 Tauri 依赖后）:
  ```bash
  npm run tauri dev    # 开发构建
  npm run tauri build  # 生产构建
  ```

- **构建产物**:
  - 安装程序: `src-tauri/target/release/bundle/msi/`
  - 可执行文件: `src-tauri/target/release/`

- **签名**: 为 Windows 应用程序添加数字签名

### 自动更新（目标，依赖 Tauri）

- **实现方式**: 使用 Tauri 的自动更新功能
- **更新服务器**: 配置更新服务器地址
- **更新策略**: 
  - 手动检查更新
  - 自动检查更新
  - 强制更新（重要安全修复）

## 运维策略

### 监控

- **应用监控**: 监控应用程序运行状态
- **错误监控**: 收集和分析运行时错误
- **性能监控**: 监控应用程序性能指标
- **用户行为监控**: 分析用户使用模式

### 日志管理

- **日志级别**: debug、info、warn、error
- **日志存储**: 本地文件系统
- **日志轮转**: 定期轮转日志文件，防止文件过大
- **日志分析**: 分析日志，识别问题和优化机会

### 备份策略

- **配置备份**: 备份应用程序配置
- **数据备份**: 备份用户数据和分析历史
- **代码备份**: 通过 Git 版本控制备份代码

### 灾备方案

- **应急响应**: 制定应急响应计划
- **回滚策略**: 定义版本回滚流程
- **故障演练**: 定期进行故障演练

## 安全策略

### 部署安全

- **最小权限**: 应用程序以最小必要权限运行
- **防火墙**: 配置适当的防火墙规则
- **防病毒**: 确保部署环境安装防病毒软件
- **定期扫描**: 定期扫描安全漏洞

### 密钥管理

- **环境变量**: 使用环境变量存储敏感信息
- **密钥轮换**: 定期轮换 API 密钥和凭证
- **密钥隔离**: 不同环境使用不同的密钥
- **密钥保护**: 确保密钥不被提交到版本控制系统

### 依赖管理

- **依赖检查**: 定期检查依赖项的安全漏洞
- **依赖锁定**: 使用 bun.lock（或 package-lock.json）锁定依赖版本
- **依赖更新**: 定期更新依赖项，修复安全漏洞
- **依赖审计**: 执行 `npm audit` 或 `bun audit` 检查依赖项安全

## CI/CD 集成

### GitHub Actions 配置

```yaml
# .github/workflows/build.yml
name: Build

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main, dev ]

jobs:
  build:
    runs-on: windows-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run lint
      run: npm run lint
    
    - name: Build
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build
        path: dist
```

### 发布工作流

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags: [ v* ]

jobs:
  release:
    runs-on: windows-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run lint
      run: npm run lint
    
    - name: Build
      run: npm run build
    
    - name: Create GitHub Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: Release ${{ github.ref }}
        draft: false
        prerelease: false
```

## 常见部署问题及解决方案

### 构建失败

- **问题**: 构建过程中出现错误
- **解决方案**: 
  - 检查依赖项是否正确安装
  - 检查环境变量是否设置
  - 检查构建配置是否正确
  - 查看详细的构建日志

### 部署失败

- **问题**: 部署过程中出现错误
- **解决方案**: 
  - 检查部署环境是否满足要求
  - 检查网络连接是否正常
  - 检查部署配置是否正确
  - 查看详细的部署日志

### 应用程序启动失败

- **问题**: 应用程序启动后立即崩溃
- **解决方案**: 
  - 检查日志文件，识别错误原因
  - 检查依赖项是否正确安装
  - 检查环境变量是否设置
  - 检查应用程序权限是否正确

### 性能问题

- **问题**: 应用程序运行缓慢
- **解决方案**: 
  - 分析应用程序性能，识别瓶颈
  - 优化代码和资源
  - 增加硬件资源（如果必要）
  - 配置缓存策略

### 安全问题

- **问题**: 应用程序存在安全漏洞
- **解决方案**: 
  - 及时更新依赖项
  - 修复安全漏洞
  - 加强访问控制
  - 定期进行安全审计

## 结论

部署规范是确保 WinLink Migrator 项目成功部署和运维的关键组成部分。通过遵循本规范，开发团队可以确保应用程序在不同环境中稳定运行，并提供清晰的发布流程和版本控制机制。部署和运维是一个持续改进的过程，应定期审查和更新本规范，以适应项目的发展和变化。