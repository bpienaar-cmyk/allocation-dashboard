import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  className = '',
}) => {
  const getTrendColor = (trendType?: 'up' | 'down' | 'flat'): string => {
    switch (trendType) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'flat':
        return 'text-slate-400';
      default:
        return '';
    }
  };

  const getTrendArrow = (trendType?: 'up' | 'down' | 'flat'): string => {
    switch (trendType) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'flat':
        return '→';
      default:
        return '';
    }
  };

  return (
    <div
      className={`rounded-xl bg-slate-800 p-6 border border-slate-700 hover:border-blue-500 transition-colors ${className}`}
    >
      <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>

      <div className="flex items-center justify-between">
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${getTrendColor(trend)}`}>
            <span>{getTrendArrow(trend)}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
