import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
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

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DailyAnalytics = ({ videos }: { videos: VideoData[] }) => {
  // Upload frequency by day of week
  const dayData = DAYS.map((day, i) => {
    const dayVideos = videos.filter((v) => new Date(v.publishedAt).getDay() === i);
    const totalViews = dayVideos.reduce((s, v) => s + v.views, 0);
    const totalLikes = dayVideos.reduce((s, v) => s + v.likes, 0);
    return { day, uploads: dayVideos.length, avgViews: dayVideos.length > 0 ? Math.round(totalViews / dayVideos.length) : 0, totalLikes };
  });

  // Views timeline by publish date
  const timeline = [...videos]
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
    .map((v) => ({
      date: new Date(v.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: v.views,
      likes: v.likes,
      engagement: v.views > 0 ? ((v.likes / v.views) * 100) : 0,
    }));

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-2 h-8 bg-neon rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">Daily Analytics</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload pattern by day of week */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-xl p-6"
          >
            <div className="mb-6">
              <h3 className="font-semibold text-foreground">Upload Pattern</h3>
              <p className="text-xs text-muted-foreground font-mono">Avg views by day of week</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 16%)" />
                <XAxis dataKey="day" tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatNum} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgViews" fill="hsl(160, 80%, 55%)" radius={[4, 4, 0, 0]} name="Avg Views" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Views timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-xl p-6"
          >
            <div className="mb-6">
              <h3 className="font-semibold text-foreground">Views Timeline</h3>
              <p className="text-xs text-muted-foreground font-mono">Views per upload over time</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 16%)" />
                <XAxis dataKey="date" tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 10 }} axisLine={false} tickLine={false} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatNum} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="views" stroke="hsl(8, 90%, 60%)" strokeWidth={2} dot={{ fill: "hsl(8, 90%, 60%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DailyAnalytics;
