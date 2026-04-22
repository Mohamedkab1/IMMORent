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

const RevenueChart = ({ data, title }) => {
  // Mapper les mois numériques en noms
  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  
  const formattedData = data.map(item => ({
    ...item,
    name: monthNames[parseInt(item.month) - 1] || item.month
  }));

  return (
    <div className="bg-[var(--card-bg)] p-6 rounded-3xl border border-[var(--border-color)] shadow-sm h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight">{title}</h3>
        <select className="text-xs font-semibold bg-[var(--bg-muted)] border-none rounded-lg focus:ring-0 text-[var(--text-muted)]">
          <option>Derniers 12 mois</option>
          <option>2024</option>
        </select>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600}}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600}}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#3b82f6" 
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
