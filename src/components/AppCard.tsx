import React from 'react';
import { AppFolder } from '../types';
import { translate } from '../translations';

export interface AppCardProps {
  app: AppFolder;
  onAnalyzeSafety: (id: string) => void;
  onMove: (id: string) => void;
  language: 'en' | 'zh';
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  onAnalyzeSafety,
  onMove,
  language
}): JSX.Element => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case '准备好':
      case 'Ready':
        return 'border-slate-700';
      case '分析':
      case 'Analyzing':
        return 'border-purple-500';
      case '移动':
      case 'Moving':
        return 'border-blue-500';
      case '已移动':
      case 'Moved':
        return 'border-green-500';
      case '错误':
      case 'Error':
        return 'border-red-500';
      case '暂停':
      case 'Paused':
        return 'border-yellow-500';
      case '验证':
      case 'Verifying':
        return 'border-cyan-500';
      default:
        return 'border-slate-700';
    }
  };

  return (
    <div className={`app-card border ${getStatusColor(app.status)}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{app.name}</h3>
        <span className="px-2 py-1 text-xs rounded-full bg-slate-800">
          {app.status}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">{translate('size', language)}:</span>
          <span>{app.size}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">{translate('path', language)}:</span>
          <span className="font-mono text-xs truncate max-w-full">{app.sourcePath}</span>
        </div>
        
        {app.safetyScore !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">{translate('safetyScore', language)}:</span>
            <span className={`font-semibold ${app.safetyScore > 70 ? 'text-green-400' : app.safetyScore > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {app.safetyScore}/100
            </span>
          </div>
        )}
        
        {app.moveStep && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">{translate('status', language)}:</span>
            <span>{app.moveStep}</span>
          </div>
        )}
        
        {app.progress !== undefined && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400">{translate('progress', language)}:</span>
              <span>{app.progress}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${app.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <button
          className="btn btn-primary flex-1"
          onClick={() => onAnalyzeSafety(app.id)}
        >
          {translate('analyzeSafety', language)}
        </button>
        <button
          className="btn btn-secondary flex-1"
          onClick={() => onMove(app.id)}
        >
          {translate('move', language)}
        </button>
      </div>
    </div>
  );
};
