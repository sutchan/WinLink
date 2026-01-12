type Theme = 'dark' | 'light' | 'system';

class ThemeService {
  private readonly THEME_KEY = 'winlink_theme';
  private currentTheme: Theme = 'system';
  private themeListeners: Array<(theme: Theme) => void> = [];

  constructor() {
    // 初始化时从 localStorage 加载主题
    this.loadTheme();
    // 监听系统主题变化
    this.setupSystemThemeListener();
  }

  /**
   * 加载主题设置
   */
  private loadTheme(): void {
    try {
      const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
      if (savedTheme) {
        this.currentTheme = savedTheme;
      }
      this.applyTheme();
    } catch (error) {
      console.error('加载主题设置失败:', error);
      this.currentTheme = 'system';
      this.applyTheme();
    }
  }

  /**
   * 保存主题设置
   * @param theme 主题
   */
  private saveTheme(theme: Theme): void {
    try {
      localStorage.setItem(this.THEME_KEY, theme);
    } catch (error) {
      console.error('保存主题设置失败:', error);
    }
  }

  /**
   * 应用主题
   */
  private applyTheme(): void {
    const effectiveTheme = this.getEffectiveTheme();
    
    // 移除所有主题类
    document.documentElement.classList.remove('dark', 'light');
    // 添加当前主题类
    document.documentElement.classList.add(effectiveTheme);
    
    // 触发主题变化回调
    this.themeListeners.forEach(listener => listener(this.currentTheme));
  }

  /**
   * 设置系统主题监听器
   */
  private setupSystemThemeListener(): void {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        if (this.currentTheme === 'system') {
          this.applyTheme();
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
    }
  }

  /**
   * 获取当前主题
   * @returns 当前主题
   */
  getTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * 获取实际应用的主题
   * @returns 实际应用的主题
   */
  getEffectiveTheme(): 'dark' | 'light' {
    if (this.currentTheme === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return this.currentTheme;
  }

  /**
   * 设置主题
   * @param theme 主题
   */
  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.saveTheme(theme);
    this.applyTheme();
  }

  /**
   * 切换主题
   */
  toggleTheme(): void {
    const themes: Theme[] = ['dark', 'light', 'system'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  /**
   * 订阅主题变化
   * @param listener 监听函数
   * @returns 取消订阅函数
   */
  subscribe(listener: (theme: Theme) => void): () => void {
    this.themeListeners.push(listener);
    // 立即调用一次，传递当前主题
    listener(this.currentTheme);
    
    // 返回取消订阅函数
    return () => {
      this.themeListeners = this.themeListeners.filter(l => l !== listener);
    };
  }
}

// 导出单例实例
export const themeService = new ThemeService();
export type { Theme };
