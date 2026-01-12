import React, { useRef, useEffect, useState } from 'react';
import { TerminalLogEntry } from '../types';
import { logService } from '../services/logService';
import { translate } from '../translations';

export interface TerminalLogProps {
  language?: 'en' | 'zh';
}

export const TerminalLog: React.FC<TerminalLogProps> = ({ language = 'zh' }): JSX.Element => {
  const currentLanguage: 'en' | 'zh' = language as 'en' | 'zh';

  const terminalRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<TerminalLogEntry[]>(logService.getLogs());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<Array<'info' | 'success' | 'warning' | 'error' | 'command'>>([
    'info', 'success', 'warning', 'error', 'command'
  ]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // 定期更新日志
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(logService.getLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // 过滤日志
  const filteredLogs = logs.filter((log: TerminalLogEntry) => {
    const matchesSearch = !searchTerm || log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.includes(log.type);
    return matchesSearch && matchesType;
  });

  const getLogClass = (type: 'info' | 'success' | 'warning' | 'error' | 'command'): string => {
    switch (type) {
      case 'command':
        return 'terminal-log-entry-command';
      case 'success':
        return 'terminal-log-entry-success';
      case 'error':
        return 'terminal-log-entry-error';
      case 'warning':
        return 'terminal-log-entry-warning';
      case 'info':
      default:
        return 'terminal-log-entry-info';
    }
  };

  const handleTypeToggle = (type: 'info' | 'success' | 'warning' | 'error' | 'command') => {
    setSelectedTypes((prev: Array<'info' | 'success' | 'warning' | 'error' | 'command'>) =>
      prev.includes(type)
        ? prev.filter((t: 'info' | 'success' | 'warning' | 'error' | 'command') => t !== type)
        : [...prev, type]
    );
  };

  const handleClearLogs = () => {
    logService.clearLogs();
    setLogs([]);
  };

  const handleExportLogs = (format: 'text' | 'json') => {
    const options: { types?: Array<'info' | 'success' | 'warning' | 'error' | 'command'>; searchTerm?: string } = {};
    if (selectedTypes.length > 0) {
      options.types = selectedTypes;
    }
    if (searchTerm) {
      options.searchTerm = searchTerm;
    }
    logService.downloadLogs(format, options);
  };

  return (
    <div className="flex flex-col h-64 dark:border-t dark:border-slate-700 border-t border-slate-200">
      {/* 终端工具栏 */}
      <div className="dark:bg-slate-900 dark:border-b dark:border-slate-700 bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold">{translate('terminal', currentLanguage)}</h3>
          
          <div className="flex items-center gap-2">
            <button
              className="text-xs px-2 py-1 rounded dark:bg-slate-800 dark:hover:bg-slate-700 bg-slate-200 hover:bg-slate-300 dark:text-white text-slate-900"
              onClick={() => setShowFilters(!showFilters)}
            >
              {translate('filter', currentLanguage)}
            </button>
            <button
              className="text-xs px-2 py-1 rounded dark:bg-slate-800 dark:hover:bg-slate-700 bg-slate-200 hover:bg-slate-300 dark:text-white text-slate-900"
              onClick={() => handleClearLogs()}
            >
              {translate('clear', currentLanguage)}
            </button>

            <div className="flex items-center gap-1">
              <button
                className="text-xs px-2 py-1 rounded dark:bg-slate-800 dark:hover:bg-slate-700 bg-slate-200 hover:bg-slate-300 dark:text-white text-slate-900"
                onClick={() => handleExportLogs('text')}
              >
                {translate('export', currentLanguage)} .txt
              </button>
              <button
                className="text-xs px-2 py-1 rounded dark:bg-slate-800 dark:hover:bg-slate-700 bg-slate-200 hover:bg-slate-300 dark:text-white text-slate-900"
                onClick={() => handleExportLogs('json')}
              >
                .json
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`${translate('search', currentLanguage)}...`}
            className="text-xs dark:bg-slate-800 dark:border dark:border-slate-700 bg-white border border-slate-300 dark:text-white text-slate-900 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 过滤器 */}
      {showFilters && (
        <div className="dark:bg-slate-800 dark:border-b dark:border-slate-700 bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-4 text-xs">
          <span>{translate('filterByType', currentLanguage)}:</span>
          <div className="flex items-center gap-2">
            {[
              { type: 'info' as const, label: translate('info', currentLanguage) },
              { type: 'success' as const, label: translate('success', currentLanguage) },
              { type: 'warning' as const, label: translate('warning', currentLanguage) },
              { type: 'error' as const, label: translate('danger', currentLanguage) },
              { type: 'command' as const, label: 'Command' }
            ].map(({ type, label }) => (

              <label key={type} className="flex items-center gap-1 cursor-pointer dark:text-white text-slate-900">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeToggle(type)}
                  className="w-3 h-3 rounded border-slate-600 text-primary-600 focus:ring-primary-500"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 终端内容 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 dark:bg-slate-900 bg-slate-50" ref={terminalRef}>
        <div className="space-y-1">
          {filteredLogs.length === 0 ? (
            <div className="dark:text-slate-500 text-slate-400 text-sm">{translate('noLogsFound', currentLanguage)}</div>
          ) : (
            filteredLogs.map((log: TerminalLogEntry) => (
              <div 
                key={log.id} 
                className={`terminal-log-entry ${getLogClass(log.type)}`}
              >
                <span className="dark:text-slate-500 text-slate-400 mr-2">[{log.timestamp}]</span>
                {log.type === 'command' ? (
                  <span className="mr-2">$</span>
                ) : null}
                <span>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
