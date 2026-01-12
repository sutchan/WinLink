import { TerminalLogEntry } from '../types';

class LogService {
  private logs: TerminalLogEntry[] = [];
  private maxLogs: number = 1000;

  /**
   * 添加日志条目
   * @param message 日志消息
   * @param type 日志类型
   * @returns 日志条目
   */
  addLog(message: string, type: 'info' | 'success' | 'warning' | 'error' | 'command' = 'info'): TerminalLogEntry {
    const logEntry: TerminalLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };

    this.logs.push(logEntry);

    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(this.logs.length - this.maxLogs);
    }

    return logEntry;
  }

  /**
   * 添加命令日志
   * @param command 命令
   * @returns 日志条目
   */
  addCommand(command: string): TerminalLogEntry {
    return this.addLog(command, 'command');
  }

  /**
   * 添加成功日志
   * @param message 成功消息
   * @returns 日志条目
   */
  addSuccess(message: string): TerminalLogEntry {
    return this.addLog(message, 'success');
  }

  /**
   * 添加警告日志
   * @param message 警告消息
   * @returns 日志条目
   */
  addWarning(message: string): TerminalLogEntry {
    return this.addLog(message, 'warning');
  }

  /**
   * 添加错误日志
   * @param message 错误消息
   * @returns 日志条目
   */
  addError(message: string): TerminalLogEntry {
    return this.addLog(message, 'error');
  }

  /**
   * 添加信息日志
   * @param message 信息消息
   * @returns 日志条目
   */
  addInfo(message: string): TerminalLogEntry {
    return this.addLog(message, 'info');
  }

  /**
   * 获取所有日志
   * @returns 日志条目数组
   */
  getLogs(): TerminalLogEntry[] {
    return [...this.logs];
  }

  /**
   * 过滤日志
   * @param filters 过滤条件
   * @returns 过滤后的日志条目数组
   */
  filterLogs(filters: {
    types?: ('info' | 'success' | 'warning' | 'error' | 'command')[];
    searchTerm?: string;
    startTime?: string;
    endTime?: string;
  }): TerminalLogEntry[] {
    return this.logs.filter(log => {
      // 类型过滤
      if (filters.types && filters.types.length > 0 && !filters.types.includes(log.type)) {
        return false;
      }

      // 搜索词过滤
      if (filters.searchTerm && !log.message.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      // 时间过滤
      if (filters.startTime) {
        const logTime = new Date(`2000-01-01 ${log.timestamp}`).getTime();
        const startTime = new Date(`2000-01-01 ${filters.startTime}`).getTime();
        if (logTime < startTime) {
          return false;
        }
      }

      if (filters.endTime) {
        const logTime = new Date(`2000-01-01 ${log.timestamp}`).getTime();
        const endTime = new Date(`2000-01-01 ${filters.endTime}`).getTime();
        if (logTime > endTime) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * 搜索日志
   * @param searchTerm 搜索词
   * @returns 搜索结果
   */
  searchLogs(searchTerm: string): TerminalLogEntry[] {
    return this.filterLogs({ searchTerm });
  }

  /**
   * 按类型获取日志
   * @param type 日志类型
   * @returns 日志条目数组
   */
  getLogsByType(type: 'info' | 'success' | 'warning' | 'error' | 'command'): TerminalLogEntry[] {
    return this.filterLogs({ types: [type] });
  }

  /**
   * 清空日志
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * 导出日志
   * @param format 导出格式
   * @param filters 过滤条件
   * @returns 导出内容
   */
  exportLogs(
    format: 'text' | 'json' = 'text',
    filters?: {
      types?: ('info' | 'success' | 'warning' | 'error' | 'command')[];
      searchTerm?: string;
    }
  ): string {
    const logsToExport = filters ? this.filterLogs(filters) : this.logs;

    if (format === 'json') {
      return JSON.stringify(logsToExport, null, 2);
    } else {
      return logsToExport
        .map(log => {
          const prefix = log.type === 'command' ? '$ ' : '';
          return `[${log.timestamp}] [${log.type.toUpperCase()}] ${prefix}${log.message}`;
        })
        .join('\n');
    }
  }

  /**
   * 下载日志文件
   * @param format 导出格式
   * @param filters 过滤条件
   */
  downloadLogs(
    format: 'text' | 'json' = 'text',
    filters?: {
      types?: ('info' | 'success' | 'warning' | 'error' | 'command')[];
      searchTerm?: string;
    }
  ): void {
    const content = this.exportLogs(format, filters);
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `winlink-logs-${new Date().toISOString().slice(0, 10)}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * 设置最大日志数量
   * @param max 最大日志数量
   */
  setMaxLogs(max: number): void {
    this.maxLogs = max;
    // 如果当前日志数量超过最大值，截断
    if (this.logs.length > max) {
      this.logs = this.logs.slice(this.logs.length - max);
    }
  }

  /**
   * 获取日志统计信息
   * @returns 日志统计信息
   */
  getLogStats(): {
    total: number;
    byType: Record<string, number>;
  } {
    const stats = {
      total: this.logs.length,
      byType: {
        info: 0,
        success: 0,
        warning: 0,
        error: 0,
        command: 0
      }
    };

    this.logs.forEach(log => {
      stats.byType[log.type]++;
    });

    return stats;
  }
}

// 导出单例实例
export const logService = new LogService();
