import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';
import { useLanguage } from '../../context/LanguageContext';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
  const { t } = useLanguage();
  const colorClasses = {
    blue: "bg-blue-500 shadow-blue-500/20",
    green: "bg-emerald-500 shadow-emerald-500/20",
    amber: "bg-amber-500 shadow-amber-500/20",
    rose: "bg-rose-500 shadow-rose-500/20",
    indigo: "bg-indigo-500 shadow-indigo-500/20"
  };

  const iconClasses = {
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    green: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
    amber: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
    rose: "text-rose-500 bg-rose-50 dark:bg-rose-900/20",
    indigo: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
  };

  return (
    <div className="bg-bg-card rounded-3xl p-6 shadow-main border border-border-main hover:shadow-large transition-all duration-300 group overflow-hidden relative">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-semibold text-text-sub mb-1 uppercase tracking-tight">{title}</p>
          <h3 className="text-3xl font-black text-text-main tracking-tighter leading-none mb-4">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1">
              <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded-lg ${trend === 'up' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' : 'text-rose-600 bg-rose-50 dark:bg-rose-900/30'}`}>
                {trend === 'up' ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                {trendValue}
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{t('admin.dashboard.vs_last_month', 'vs mois dernier')}</span>
            </div>
          )}
        </div>
        
        <div className={`p-3.5 rounded-2xl flex-shrink-0 ${iconClasses[color]}`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
      
      {/* Decorative gradient blob */}
      <div className={`absolute -right-12 -bottom-12 w-32 h-32 rounded-full opacity-[0.05] group-hover:scale-125 transition-transform duration-700 ${colorClasses[color]}`}></div>
    </div>
  );
};

export default StatsCard;
