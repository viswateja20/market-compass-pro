import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';

const monthlySales = [
  { month: 'Oct', sales: 4200 }, { month: 'Nov', sales: 5100 },
  { month: 'Dec', sales: 6800 }, { month: 'Jan', sales: 5400 },
  { month: 'Feb', sales: 7200 }, { month: 'Mar', sales: 8200 },
];

const productDist = [
  { name: 'Electronics', value: 35 }, { name: 'Clothing', value: 25 },
  { name: 'Food & Bev', value: 20 }, { name: 'Home & Garden', value: 12 },
  { name: 'Other', value: 8 },
];

const revenueTrend = [
  { month: 'Oct', revenue: 32000 }, { month: 'Nov', revenue: 35000 },
  { month: 'Dec', revenue: 42000 }, { month: 'Jan', revenue: 38000 },
  { month: 'Feb', revenue: 44000 }, { month: 'Mar', revenue: 48200 },
];

const PIE_COLORS = [
  'hsl(145, 65%, 42%)', 'hsl(38, 95%, 55%)', 'hsl(200, 70%, 50%)',
  'hsl(280, 60%, 55%)', 'hsl(0, 72%, 51%)',
];

const stats = [
  { title: 'Total Revenue', value: '$48,200', change: '+12.5%', up: true, icon: DollarSign },
  { title: 'Total Orders', value: '1,245', change: '+8.2%', up: true, icon: ShoppingCart },
  { title: 'Active Customers', value: '892', change: '+5.1%', up: true, icon: Users },
  { title: 'Growth Rate', value: '23.8%', change: '-2.4%', up: false, icon: TrendingUp },
];

export default function DashboardPage() {
  const [selectedStat, setSelectedStat] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your business performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card
              className="glass cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setSelectedStat(selectedStat === s.title ? null : s.title)}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{s.title}</span>
                  <s.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className={`flex items-center gap-1 text-xs mt-1 ${s.up ? 'text-primary' : 'text-destructive'}`}>
                  {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.change} from last month
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedStat && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Card className="glass">
            <CardContent className="pt-4">
              <p className="text-sm text-foreground font-medium mb-2">{selectedStat} — Breakdown</p>
              <p className="text-xs text-muted-foreground">
                {selectedStat === 'Total Revenue' && 'Revenue has grown steadily over the past 6 months, driven primarily by electronics and digital services.'}
                {selectedStat === 'Total Orders' && '1,245 orders processed this month. Average order value: $38.71. Peak ordering days: Monday & Thursday.'}
                {selectedStat === 'Active Customers' && '892 active customers with 67% retention rate. 124 new customers acquired this month.'}
                {selectedStat === 'Growth Rate' && 'Growth rate slightly declined due to seasonal adjustments. Expected to recover in Q2.'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(220, 25%, 10%)', border: '1px solid hsl(220, 20%, 18%)', borderRadius: '8px', color: 'white' }} />
                <Bar dataKey="sales" fill="hsl(145, 65%, 42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Product Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={productDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {productDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(220, 25%, 10%)', border: '1px solid hsl(220, 20%, 18%)', borderRadius: '8px', color: 'white' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 18%)" />
              <XAxis dataKey="month" stroke="hsl(220, 10%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(220, 25%, 10%)', border: '1px solid hsl(220, 20%, 18%)', borderRadius: '8px', color: 'white' }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(145, 65%, 50%)" strokeWidth={2} dot={{ fill: 'hsl(145, 65%, 50%)' }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
