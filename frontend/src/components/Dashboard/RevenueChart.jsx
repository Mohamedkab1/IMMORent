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
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-card border border-border-main p-4 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">{label}</p>
        <p className="text-base font-black text-primary">
          {new Intl.NumberFormat('fr-FR').format(payload[0].value)} <span className="text-[9px] opacity-60">DH</span>
        </p>
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ data, title }) => {
  const { t, language } = useLanguage();
  
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full min-h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
            dy={15}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
            tickFormatter={(value) => `${value > 999 ? (value/1000) + 'k' : value}`}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '5 5' }} />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#2563eb" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorTotal)"
            animationDuration={2000}
            dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8, fill: '#2563eb', strokeWidth: 0, shadow: '0 0 20px rgba(37,99,235,0.8)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default RevenueChart;
