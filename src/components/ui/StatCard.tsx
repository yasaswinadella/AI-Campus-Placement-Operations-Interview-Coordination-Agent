import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  iconBgColor = 'bg-[#F5F3FF]',
  iconColor = 'text-[#4F46E5]',
  highlight = false,
}) => {
  if (highlight) {
    return (
      <div
        id={id}
        className="rounded-xl p-5 relative overflow-hidden text-white shadow-md transition-all hover:shadow-lg"
        style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)' }}
      >
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#C7D2FE]">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-white tracking-tight">{value}</h3>
            {subtitle && <p className="text-[11px] text-[#C7D2FE]/80 mt-1 font-medium">{subtitle}</p>}
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white border border-white/10 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        </div>
        {change && (
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-[#C7D2FE]">
            <TrendingUp className="w-3 h-3 text-[#22C55E]" />
            <span className="font-bold text-white">{change}</span>
            <span>vs last month</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      id={id}
      className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748B]">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-[#0F172A] tracking-tight">{value}</h3>
          {subtitle && <p className="text-[11px] text-[#64748B] mt-1 font-medium">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg ${iconBgColor} ${iconColor} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {change && (
        <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex items-center gap-1.5 text-[11px]">
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-[#22C55E]" />
          ) : (
            <TrendingDown className="w-3 h-3 text-[#EF4444]" />
          )}
          <span className={`font-bold ${isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {change}
          </span>
          <span className="text-[#64748B]">benchmark</span>
        </div>
      )}
    </div>
  );
};

