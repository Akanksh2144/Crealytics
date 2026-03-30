import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const viewsData = [
  { month: "Jan", views: 12400000, subs: 45000 },
  { month: "Feb", views: 15200000, subs: 52000 },
  { month: "Mar", views: 13800000, subs: 48000 },
  { month: "Apr", views: 18600000, subs: 71000 },
  { month: "May", views: 22100000, subs: 89000 },
  { month: "Jun", views: 19400000, subs: 63000 },
  { month: "Jul", views: 25700000, subs: 95000 },
  { month: "Aug", views: 28300000, subs: 110000 },
  { month: "Sep", views: 24100000, subs: 87000 },
  { month: "Oct", views: 31200000, subs: 125000 },
  { month: "Nov", views: 35800000, subs: 142000 },
  { month: "Dec", views: 42100000, subs: 168000 },
];

const engagementData = [
  { day: "Mon", likes: 84000, comments: 12000, shares: 5400 },
  { day: "Tue", likes: 92000, comments: 15000, shares: 6100 },
  { day: "Wed", likes: 78000, comments: 11000, shares: 4800 },
  { day: "Thu", likes: 105000, comments: 18000, shares: 7200 },
  { day: "Fri", likes: 118000, comments: 22000, shares: 8900 },
  { day: "Sat", likes: 145000, comments: 28000, shares: 11200 },
  { day: "Sun", likes: 132000, comments: 25000, shares: 9800 },
];

const formatNum = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass rounded-lg px-4 py-3 shadow-xl border border-border">
      <p className="font-mono text-xs text-muted-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="font-mono text-sm" style={{ color: p.color }}>
          {p.dataKey}: {formatNum(p.value)}
        </p>
      ))}
    </div>
  );
};

const PerformanceCharts = () => (
  <section className="py-20">
    <div className="container mx-auto px-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-2 h-8 bg-neon rounded-full" />
        <h2 className="text-2xl font-bold text-foreground">Performance Analytics</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views & Subscribers */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Views & Subscribers</h3>
              <p className="text-xs text-muted-foreground font-mono">12-month trend</p>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Views
              </span>
              <span className="flex items-center gap-1.5 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-neon" /> Subs
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={viewsData}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(8, 90%, 60%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(8, 90%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="subsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(160, 80%, 55%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(160, 80%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 16%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatNum} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="views" stroke="hsl(8, 90%, 60%)" fill="url(#viewsGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="subs" stroke="hsl(160, 80%, 55%)" fill="url(#subsGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Engagement Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Engagement Breakdown</h3>
              <p className="text-xs text-muted-foreground font-mono">Weekly average</p>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Likes
              </span>
              <span className="flex items-center gap-1.5 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-neon" /> Comments
              </span>
              <span className="flex items-center gap-1.5 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(270, 70%, 60%)" }} /> Shares
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 16%)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatNum} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="likes" fill="hsl(8, 90%, 60%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="comments" fill="hsl(160, 80%, 55%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="shares" fill="hsl(270, 70%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  </section>
);

export default PerformanceCharts;
