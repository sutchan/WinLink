# 项目上下文

## 项目目的

WinLink Migrator 是一个 Windows 实用工具仪表盘，旨在帮助用户将应用程序数据从系统盘（C盘）迁移到其他分区，并通过创建符号链接（Symbolic Links / Junctions）保持原有路径的访问性。项目集成 Google Gemini AI，用于评估迁移操作的安全性。

## 技术栈

- **前端框架**: React 18, TypeScript, Tailwind CSS
- **构建工具**: Vite 5.2.0
- **测试框架**: Vitest, @testing-library/react
- **代码质量**: ESLint, Prettier
- **样式**: Tailwind CSS 3.4.3, PostCSS, Autoprefixer
- **AI 服务**: Google GenAI SDK (@google/genai - Gemini 1.5)
- **构建/运行环境**: 浏览器 (当前), 目标为 Tauri

## 架构设计

### 架构模式

- **React 组件化架构**: 基于组件的模块化设计
- **服务导向设计**: 外部集成的服务导向架构
- **状态管理**: 使用 Context API 进行状态管理（可扩展到 Zustand/Redux）
- **模块化目录结构**: 基于功能的模块化组织

### 核心服务

1. **diskService**: 负责磁盘和应用程序扫描
   - 扫描系统磁盘和分区
   - 检测和分析应用程序数据
   - 计算磁盘空间使用情况

2. **geminiService**: 负责 AI 安全分析
   - 集成 Google Gemini AI API
   - 分析应用程序安全性
   - 生成风险评估和建议

3. **migrationService**: 负责应用程序迁移
   - 执行应用程序数据迁移
   - 创建符号链接保持路径访问性
   - 处理迁移过程中的错误和异常

4. **logService**: 负责日志记录
   - 记录系统事件和操作过程
   - 管理不同类型的日志条目
   - 提供日志查询和过滤功能

5. **themeService**: 负责主题管理
   - 管理应用程序主题
   - 支持浅色、深色和系统主题
   - 主题切换和持久化

6. **analysisHistoryService**: 负责分析历史管理
   - 存储和管理 AI 分析历史
   - 提供历史分析查询功能
   - 分析结果导出和分享

## 领域上下文

### 核心概念

- **Windows 文件系统操作**: robocopy、mklink 等命令的使用
- **符号链接和 Junction**: 保持路径访问性的技术
- **磁盘空间管理**: 分析和优化磁盘空间使用
- **AI 辅助安全分析**: 使用 AI 评估迁移操作的安全性
- **应用程序数据迁移**: 将应用程序数据从一个位置移动到另一个位置

### 重要约束

- **管理员权限**: 创建 Junction 需要管理员权限
- **文件系统权限**: 受限于 Windows 文件系统权限
- **网络依赖**: AI 分析需要网络连接
- **性能考虑**: 大型文件迁移的性能优化
- **兼容性**: 不同 Windows 版本的兼容性

## 外部依赖

- **Google Gemini AI API**: 用于安全分析
- **Windows 命令提示符**: 用于文件操作
- **Tauri**: 用于实现原生功能

## 技术实现细节

### 状态管理

- 使用 React useState 和 useEffect 钩子管理组件状态
- 服务层采用单例模式管理全局状态
- 考虑使用 Zustand 或 Redux 进行更复杂的状态管理

### 国际化实现

- 基于 JSON 文件的国际化系统
- 支持动态切换语言
- 文本翻译管理和维护

### 主题管理

- 基于 CSS 变量和 Tailwind 类的主题系统
- 支持浅色、深色和系统主题
- 主题偏好的持久化存储

### API 集成

- **Google Gemini AI API 集成**
  - 使用 @google/genai 库进行 API 调用
  - 实现请求重试和错误处理机制
  - 优化 API 调用频率，避免超出配额
  - 实现请求和响应的日志记录
  - **API 调用参数详细说明**:
    - `model`: 使用 'gemini-1.5-flash' 模型
    - `temperature`: 0.3 (低随机性，更准确的结果)
    - `maxOutputTokens`: 1024 (限制响应长度)
    - `topP`: 0.8 (控制输出的多样性)
  - **错误处理机制**:
    - 网络错误: 自动重试 3 次，每次间隔 2 秒
    - API 错误: 捕获并解析错误码，返回友好的错误信息
    - 配额限制: 实现请求节流，避免超出 API 配额
  - **API 响应解析**:
    - 结构化解析 AI 响应
    - 提取风险等级和建议
    - 转换为应用内部数据结构

### Windows 文件系统操作

- **文件和目录操作**
  - 使用 Windows 命令行工具 (robocopy, mklink) 执行文件操作
  - 实现文件复制、移动和删除功能
  - 支持大文件和目录的高效处理
  - 实现文件操作的进度监控和错误处理
  - **robocopy 命令参数**:
    - `/E`: 复制所有子目录，包括空目录
    - `/COPYALL`: 复制所有文件属性
    - `/R:3`: 失败时重试 3 次
    - `/W:1`: 重试间隔 1 秒
    - `/LOG`: 生成详细的日志文件
    - `/NP`: 不显示复制进度（减少控制台输出）
  - **进度监控实现**:
    - 解析 robocopy 输出
    - 计算已复制文件数量和大小
    - 实时更新进度条

- **符号链接和 Junction 管理**
  - 支持创建和管理符号链接
  - 支持创建和管理 Junction 点
  - 实现链接的验证和修复功能
  - 处理权限问题和管理员权限需求
  - **mklink 命令参数**:
    - `/J`: 创建 Junction 点
    - `/D`: 创建目录符号链接
    - `/H`: 创建硬链接
  - **权限处理**:
    - 检测是否以管理员权限运行
    - 如无管理员权限，提示用户并尝试以管理员身份重启
    - 实现 UAC (用户账户控制) 提示

### 性能优化策略

- **大型文件迁移性能优化**:
  - 分块复制: 将大文件分成多个块进行复制
  - 并行处理: 多线程并行复制多个文件
  - 磁盘 I/O 优化: 减少磁盘寻道时间，优化读写模式
  - 缓存策略: 使用内存缓存减少重复 I/O 操作

- **磁盘扫描性能优化**:
  - 异步扫描: 后台线程异步扫描磁盘
  - 增量扫描: 只扫描变化的目录和文件
  - 缓存结果: 缓存扫描结果，避免重复扫描
  - 优先级排序: 优先扫描用户关注的目录

- **应用程序启动速度优化**:
  - 延迟加载: 非关键组件延迟加载
  - 资源预加载: 预加载常用资源
  - 缓存配置: 缓存应用配置和用户偏好
  - 代码分割: 按需加载代码，减少初始加载时间

- **AI 分析性能优化**:
  - 批量分析: 批量处理多个应用的安全分析
  - 结果缓存: 缓存分析结果，避免重复分析
  - 异步处理: 后台线程处理 AI 分析请求
  - 优先级队列: 优先处理用户选择的应用

### 安全分析实现

- Google Gemini AI API 集成
- 应用程序文件夹安全性分析
- 风险评估和建议生成

### 迁移实现

- Windows 命令行工具的执行
- 符号链接创建和管理
- 增量迁移和验证

## 技术决策

### 为什么选择 React + TypeScript

- **类型安全**: TypeScript 提供静态类型检查，减少运行时错误
- **组件复用**: React 的组件化设计促进代码复用
- **生态系统**: 丰富的生态系统和社区支持
- **开发效率**: 快速开发和热重载功能

### 为什么选择 Tailwind CSS

- **实用优先**: 基于实用类的样式系统
- **响应式设计**: 内置响应式工具类
- **性能优化**: 按需生成 CSS，减少文件大小
- **一致性**: 统一的设计系统和样式规范

### 为什么选择 Tauri

- **轻量级**: 相比 Electron 更轻量级
- **安全**: 内置安全特性
- **原生功能**: 直接访问系统 API
- **性能**: 更好的启动速度和运行性能

## 未来技术路线

- **迁移到 Tauri**: 实现原生文件操作
- **性能优化**: 进一步优化大型文件迁移性能
- **安全性增强**: 加强应用安全性
- **可扩展性**: 设计插件系统，支持功能扩展
- **云集成**: 集成云存储服务，支持云备份和恢复

## 代码示例和最佳实践

### API 集成示例

#### Google Gemini AI API 集成

```typescript
// services/geminiService.ts
import { GoogleGenerativeAI } from '@google/generai';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Google Gemini API key is not set');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async analyzeSafety(appPath: string): Promise<{ safetyScore: number; suggestions: string[] }> {
    try {
      const prompt = `Analyze the safety of moving the application at ${appPath}. ` +
        `Consider potential risks, compatibility issues, and best practices. ` +
        `Provide a safety score (0-100) and specific suggestions.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the response (simplified example)
      return {
        safetyScore: 85,
        suggestions: [
          'Backup the application before migration',
          'Ensure all application processes are closed',
          'Verify the target location has sufficient space'
        ]
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        safetyScore: 50,
        suggestions: ['Error analyzing safety, proceed with caution']
      };
    }
  }
}

export default new GeminiService();
```

### Windows 文件系统操作示例

#### 创建 Junction 链接

```typescript
// services/migrationService.ts
import { execSync } from 'child_process';

class MigrationService {
  createJunction(sourcePath: string, targetPath: string): boolean {
    try {
      // Use mklink /J to create a junction
      execSync(`mklink /J "${sourcePath}" "${targetPath}"`, {
        stdio: 'ignore'
      });
      return true;
    } catch (error) {
      console.error('Error creating junction:', error);
      return false;
    }
  }

  copyDirectory(source: string, target: string): boolean {
    try {
      // Use robocopy for efficient directory copying
      execSync(`robocopy "${source}" "${target}" /E /COPYALL /R:3 /W:1`, {
        stdio: 'ignore'
      });
      return true;
    } catch (error) {
      console.error('Error copying directory:', error);
      return false;
    }
  }
}

export default new MigrationService();
```

### 最佳实践指南

#### 1. 错误处理最佳实践

- **始终处理错误**: 不要忽略任何错误，即使是看似不重要的操作
- **提供有意义的错误消息**: 错误消息应清晰明了，帮助用户理解问题
- **记录错误**: 所有错误都应记录到日志系统，便于调试和分析
- **优雅降级**: 当遇到错误时，应用程序应尽可能继续运行，而不是完全崩溃

#### 2. 性能优化最佳实践

- **批量操作**: 对于大量文件操作，使用批量处理减少系统调用
- **异步操作**: 长时间运行的操作应使用异步处理，避免阻塞 UI
- **缓存策略**: 合理使用缓存，减少重复计算和 I/O 操作
- **资源清理**: 及时释放不再使用的资源，如文件句柄和内存

#### 3. 安全性最佳实践

- **最小权限原则**: 应用程序只应请求完成任务所需的最小权限
- **输入验证**: 验证所有用户输入，防止注入攻击
- **安全存储**: 敏感信息（如 API 密钥）应安全存储，避免硬编码
- **定期更新**: 定期更新依赖项，修复已知安全漏洞

#### 4. 代码质量最佳实践

- **代码风格一致性**: 使用 ESLint 和 Prettier 保持代码风格一致
- **类型安全**: 充分利用 TypeScript 的类型系统，避免类型错误
- **模块化设计**: 将代码分解为小的、可维护的模块
- **文档化**: 为公共 API 和复杂逻辑添加清晰的注释和文档

#### 5. 测试最佳实践

- **测试覆盖率**: 确保关键功能有足够的测试覆盖率
- **单元测试**: 为独立的函数和组件编写单元测试
- **集成测试**: 测试模块间的交互
- **端到端测试**: 测试完整的用户流程

#### 6. 部署最佳实践

- **环境分离**: 严格分离开发、测试和生产环境
- **自动化部署**: 使用 CI/CD 管道自动化部署流程
- **版本控制**: 遵循语义化版本规范，保持版本号一致
- **回滚策略**: 制定明确的回滚策略，以应对部署失败的情况