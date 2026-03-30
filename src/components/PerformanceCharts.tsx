import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { VideoData } from "@/hooks/useYouTubeAnalytics";

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

const PerformanceCharts = ({ videos }: { videos: VideoData[] }) => {
  // Sort by date and take up to 20 for chart
  const sorted = [...videos].sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  );

  const chartData = sorted.map((v) => ({
    name: v.title.length > 20 ? v.title.slice(0, 20) + "…" : v.title,
    views: v.views,
    likes: v.likes,
    comments: v.comments,
  }));

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-2 h-8 bg-neon rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">Performance Analytics</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views per Video */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-foreground">Views per Video</h3>
                <p className="text-xs text-muted-foreground font-mono">Recent uploads</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Views
              </span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 16%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 10 }} axisLine={false} tickLine={false} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatNum} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" fill="hsl(8, 90%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
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
                <p className="text-xs text-muted-foreground font-mono">Likes vs Comments</p>
              </div>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-neon" /> Likes
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(270, 70%, 60%)" }} /> Comments
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 16%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 10 }} axisLine={false} tickLine={false} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatNum} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="likes" fill="hsl(160, 80%, 55%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="comments" fill="hsl(270, 70%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceCharts;
