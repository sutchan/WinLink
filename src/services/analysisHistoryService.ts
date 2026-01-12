import { AiAnalysisResult } from '../types';

interface AnalysisHistoryItem {
  folderPath: string;
  folderName: string;
  analysis: AiAnalysisResult;
  timestamp: string;
  safetyScore: number;
}

class AnalysisHistoryService {
  private readonly STORAGE_KEY = 'winlink_analysis_history';
  private history: AnalysisHistoryItem[] = [];

  constructor() {
    this.loadHistory();
  }

  /**
   * 加载分析历史
   */
  private loadHistory(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (error) {
      console.error('加载分析历史失败:', error);
      this.history = [];
    }
  }

  /**
   * 保存分析历史
   */
  private saveHistory(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.history));
    } catch (error) {
      console.error('保存分析历史失败:', error);
    }
  }

  /**
   * 添加分析记录
   * @param folderPath 文件夹路径
   * @param folderName 文件夹名称
   * @param analysis 分析结果
   * @param safetyScore 安全评分
   */
  addAnalysis(
    folderPath: string,
    folderName: string,
    analysis: AiAnalysisResult,
    safetyScore: number
  ): void {
    // 移除旧的相同路径的分析记录
    this.history = this.history.filter(item => item.folderPath !== folderPath);

    // 添加新的分析记录
    const newItem: AnalysisHistoryItem = {
      folderPath,
      folderName,
      analysis,
      timestamp: new Date().toISOString(),
      safetyScore
    };

    // 添加到历史记录开头
    this.history.unshift(newItem);

    // 限制历史记录数量
    if (this.history.length > 50) {
      this.history = this.history.slice(0, 50);
    }

    // 保存到本地存储
    this.saveHistory();
  }

  /**
   * 获取分析历史
   * @param folderPath 文件夹路径（可选）
   * @returns 分析历史记录
   */
  getHistory(folderPath?: string): AnalysisHistoryItem[] {
    if (folderPath) {
      return this.history.filter(item => item.folderPath === folderPath);
    }
    return this.history;
  }

  /**
   * 获取最近的分析记录
   * @param folderPath 文件夹路径
   * @returns 最近的分析记录或 undefined
   */
  getRecentAnalysis(folderPath: string): AnalysisHistoryItem | undefined {
    return this.history.find(item => item.folderPath === folderPath);
  }

  /**
   * 清除分析历史
   * @param folderPath 文件夹路径（可选，不提供则清除所有）
   */
  clearHistory(folderPath?: string): void {
    if (folderPath) {
      this.history = this.history.filter(item => item.folderPath !== folderPath);
    } else {
      this.history = [];
    }
    this.saveHistory();
  }

  /**
   * 检查是否有有效的分析记录
   * @param folderPath 文件夹路径
   * @param maxAge 最大有效期（毫秒），默认 24 小时
   * @returns 是否有有效的分析记录
   */
  hasValidAnalysis(folderPath: string, maxAge: number = 24 * 60 * 60 * 1000): boolean {
    const recent = this.getRecentAnalysis(folderPath);
    if (!recent) return false;

    const age = Date.now() - new Date(recent.timestamp).getTime();
    return age <= maxAge;
  }
}

// 导出单例实例
export const analysisHistoryService = new AnalysisHistoryService();
