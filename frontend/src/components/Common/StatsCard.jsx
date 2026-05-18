import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const colorClasses = {
    blue: "bg-blue-500 shadow-blue-500/20",
    green: "bg-emerald-500 shadow-emerald-500/20",
    emerald: "bg-emerald-500 shadow-emerald-500/20",
    amber: "bg-amber-500 shadow-amber-500/20",
    rose: "bg-rose-500 shadow-rose-500/20",
    indigo: "bg-indigo-500 shadow-indigo-500/20"
  };

  const selectedColorClass = colorClasses[color] || colorClasses.blue;

  const iconClasses = {
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    green: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
    emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
    amber: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
    rose: "text-rose-500 bg-rose-50 dark:bg-rose-900/20",
    indigo: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
  };

  const selectedIconClass = iconClasses[color] || iconClasses.blue;

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`p-8 shadow-xl border transition-all duration-500 group overflow-hidden relative rounded-xl ${
        theme === 'light' ? 'bg-white border-slate-100' : 'bg-bg-card border-white/5'
      }`}
    >
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${
            theme === 'light' ? 'text-slate-400' : 'text-text-muted'
          }`}>{title}</p>
          <h3 className={`text-4xl font-black tracking-tighter leading-none mb-6 ${
            theme === 'light' ? 'text-slate-900' : 'text-text-main'
          }`}>{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${trend === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                {trend === 'up' ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                {trendValue}
              </span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{t('admin.dashboard.vs_last_month', 'vs mois dernier')}</span>
            </div>
          )}
        </div>
        
        <div className={`p-4 border transition-all duration-500 rounded-xl group-hover:rotate-6 group-hover:scale-105 ${
          theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-bg-soft border-border-main'
        } ${selectedIconClass.split(' ')[0]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {/* Decorative gradient blob */}
      <div className={`absolute -right-16 -bottom-16 w-48 h-48 rounded-full opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-150 transition-all duration-1000 ${selectedColorClass}`}></div>
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  );
};

export default StatsCard;
