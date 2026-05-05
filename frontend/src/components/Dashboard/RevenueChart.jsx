import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { useLanguage } from '../../context/LanguageContext';

const RevenueChart = ({ data, title }) => {
  const { t } = useLanguage();
  // Mapper les mois numériques en noms
  const monthNames = [
    t('common.months.jan'), t('common.months.feb'), t('common.months.mar'), t('common.months.apr'), 
    t('common.months.may'), t('common.months.jun'), t('common.months.jul'), t('common.months.aug'), 
    t('common.months.sep'), t('common.months.oct'), t('common.months.nov'), t('common.months.dec')
  ];
  
  const formattedData = data.map(item => ({
    ...item,
    name: monthNames[parseInt(item.month) - 1] || item.month
  }));

  return (
    <div className="bg-bg-card p-6 rounded-3xl border border-border-main shadow-main h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-text-main tracking-tight">{title}</h3>
        <select className="text-xs font-semibold bg-bg-soft border-none rounded-lg focus:ring-0 text-text-sub">
          <option value="12m">{t('admin.overview.last_12_months', 'Derniers 12 mois')}</option>
          <option value="2024">2024</option>
        </select>
      </div>
      
      <div className="h-64 w-full" style={{ minHeight: '250px' }}>
        <ResponsiveContainer width="99%" height="100%" minWidth={0}>
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-main)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: 'var(--color-text-sub)', fontSize: 12}}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: 'var(--color-text-sub)', fontSize: 12}}
              tickFormatter={(value) => `${value} DH`}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: '1px solid var(--color-border-main)', 
                boxShadow: 'var(--shadow-large)', 
                backgroundColor: 'var(--color-bg-card)',
                color: 'var(--color-text-main)'
              }}
              itemStyle={{ color: 'var(--color-primary)' }}
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="var(--color-primary)" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorTotal)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
