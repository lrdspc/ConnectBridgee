import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export interface StatCardProps {
  title: string;
  value: string | number;
  trend: number;
  color: string;
  data: { name: string; value: number }[];
}

export interface StatsBlockProps {
  stats: StatCardProps[];
}

const StatsBlock: React.FC<StatsBlockProps> = ({ stats }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat, idx) => (
        <div key={idx} className="stat-card">
          <div className="stat-info">
            <span className="stat-title">{stat.title}</span>
            <h3 className="stat-value">{stat.value}</h3>
            <div className={`stat-trend ${stat.trend > 0 ? 'positive' : 'negative'}`}>
              {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}%
            </div>
          </div>
          
          <div className="stat-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stat.data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`colorUv${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={stat.color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={stat.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <Tooltip contentStyle={{ display: 'none' }} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={stat.color} 
                  fillOpacity={1} 
                  fill={`url(#colorUv${idx})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBlock;