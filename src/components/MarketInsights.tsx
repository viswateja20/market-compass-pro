import { motion } from 'framer-motion';
import { TrendingUp, Fuel, Brain, Newspaper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';

const oilTrend = [
  { month: 'Oct', price: 82 }, { month: 'Nov', price: 78 },
  { month: 'Dec', price: 85 }, { month: 'Jan', price: 95 },
  { month: 'Feb', price: 110 }, { month: 'Mar', price: 118 },
];

const sectorDemand = [
  { sector: 'AI & Tech', index: 92, color: 'hsl(145, 65%, 42%)' },
  { sector: 'Renewables', index: 78, color: 'hsl(38, 95%, 55%)' },
  { sector: 'Digital Services', index: 71, color: 'hsl(200, 70%, 50%)' },
  { sector: 'Manufacturing', index: 45, color: 'hsl(280, 60%, 55%)' },
  { sector: 'Automotive', index: 32, color: 'hsl(0, 72%, 51%)' },
];

const globalIndicators = [
  { title: 'Global Growth', value: '2.6%', label: 'Slow', icon: TrendingUp, color: 'text-accent' },
  { title: 'Oil Price Change', value: '+50%', label: 'Surging', icon: Fuel, color: 'text-destructive' },
  { title: 'AI Sector Demand', value: '92/100', label: 'Explosive', icon: Brain, color: 'text-primary' },
];

const newsItems = [
  {
    title: 'Oil Prices to Stay Elevated Across Iran War Scenarios',
    source: 'Reuters',
    desc: 'Global oil supply reduced significantly due to geopolitical conflicts. Prices surged 50%+, affecting fuel, agriculture, transport, and manufacturing.',
  },
  {
    title: "Europe's Renewable Energy Paradox",
    source: 'Reuters',
    desc: 'Countries rapidly moving to renewables due to unstable fossil fuel supply. Demand for solar, EVs, green tech is rising but supply limited.',
  },
  {
    title: "WTO at 'Critical Juncture' and Needs Deep Reform",
    source: 'Reuters',
    desc: 'Global trade system under pressure. Companies shifting suppliers and production locations. Supply chains becoming regional instead of global.',
  },
  {
    title: 'Weak Demand Hits Automobile Sector',
    source: 'Industry Report',
    desc: 'Car production dropped due to low global demand + trade barriers. Leads to oversupply or production cuts in traditional sectors.',
  },
  {
    title: 'AI Boom Creates Semiconductor Shortages',
    source: 'Industry Analysis',
    desc: 'Huge demand for AI chips but limited production capacity. Creates shortages and long waiting times. Demand >> Supply.',
  },
];

export default function MarketInsights() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Market Insights</h1>
        <p className="text-sm text-muted-foreground">Real-time news and trends shaping demand & supply</p>
      </div>

      {/* Global Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {globalIndicators.map((g, i) => (
          <motion.div key={g.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass">
              <CardContent className="pt-4 pb-4 text-center">
                <g.icon className={`w-6 h-6 mx-auto mb-2 ${g.color}`} />
                <p className="text-xs text-muted-foreground">{g.title}</p>
                <p className="text-2xl font-bold text-foreground">{g.value}</p>
                <Badge variant="outline" className="mt-1 text-xs">{g.label}</Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Oil Price Trend ($/barrel)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={oilTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(220, 25%, 10%)', border: '1px solid hsl(220, 20%, 18%)', borderRadius: '8px', color: 'white' }} />
                <Line type="monotone" dataKey="price" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={{ fill: 'hsl(0, 72%, 51%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Sector Demand Index</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sectorDemand} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 18%)" />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <YAxis type="category" dataKey="sector" stroke="hsl(220, 10%, 55%)" fontSize={11} width={100} />
                <Tooltip contentStyle={{ background: 'hsl(220, 25%, 10%)', border: '1px solid hsl(220, 20%, 18%)', borderRadius: '8px', color: 'white' }} />
                <Bar dataKey="index" radius={[0, 4, 4, 0]}>
                  {sectorDemand.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Latest News */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Newspaper className="w-4 h-4 text-primary" /> Latest Market News
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {newsItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-sm text-foreground">{item.title}</h3>
                <Badge variant="secondary" className="text-xs shrink-0">{item.source}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
