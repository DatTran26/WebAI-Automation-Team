"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from "recharts"

interface RevenueData {
  name: string
  total: number
}

interface CategoryData {
  name: string
  value: number
}

interface AnalyticsChartsProps {
  revenueData: RevenueData[]
  categoryData: CategoryData[]
}

const COLORS = ["#831A2D", "#C8A951", "#1F4D3A", "#BD3829", "#333333", "#E6DED4"]

export function AnalyticsCharts({ revenueData, categoryData }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-stone-100">
      {/* Revenue Line Chart */}
      <div className="bg-white p-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-serif font-bold text-brand-charcoal">Revenue Trajectory</h3>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-1">Fiscal performance (7 days)</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-serif italic font-bold text-brand">$1,240.00</span>
            <p className="text-[10px] text-brand-green font-black uppercase tracking-widest mt-1">↑ 8.4%</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#A0A0A0', fontWeight: 'bold' }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#A0A0A0', fontWeight: 'bold' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '12px' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#831A2D" 
                strokeWidth={4} 
                dot={{ r: 0 }}
                activeDot={{ r: 6, fill: '#831A2D', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Categories Pie Chart */}
      <div className="bg-white p-10">
        <div className="mb-10">
          <h3 className="text-xl font-serif font-bold text-brand-charcoal">Inventory Composition</h3>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-1">Product allocation by category</p>
        </div>
        <div className="h-[300px] w-full flex items-center">
          <div className="flex-1 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-48 space-y-3">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[10px] font-bold text-text-muted uppercase group-hover:text-brand-charcoal transition-colors">{entry.name}</span>
                </div>
                <span className="text-xs font-black text-brand-charcoal">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
