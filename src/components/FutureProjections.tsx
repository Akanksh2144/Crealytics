import { motion } from "framer-motion";
import { TrendingUp, Users, Eye, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { ChannelData, VideoData } from "@/hooks/useYouTubeAnalytics";

const formatNum = (n: number) => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass rounded-lg px-4 py-3 shadow-xl border border-border">
      <p className="font-mono text-xs text-muted-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="font-mono text-sm" style={{ color: p.color }}>
          {p.name}: {formatNum(p.value)}
        </p>
      ))}
    </div>
  );
};

interface FutureProjectionsProps {
  channel: ChannelData;
  videos: VideoData[];
}

const FutureProjections = ({ channel, videos }: FutureProjectionsProps) => {
  const channelAgeDays = Math.max(1, Math.floor((Date.now() - new Date(channel.publishedAt).getTime()) / (1000 * 60 * 60 * 24)));

  // Growth rates (daily)
  const dailySubGrowth = channel.subscriberCount / channelAgeDays;
  const dailyViewGrowth = channel.viewCount / channelAgeDays;
  const uploadsPerDay = channel.videoCount / channelAgeDays;

  // Generate projection data points
  const periods = [
    { label: "Now", days: 0 },
    { label: "1 Month", days: 30 },
    { label: "3 Months", days: 90 },
    { label: "6 Months", days: 180 },
    { label: "1 Year", days: 365 },
  ];

  const projectionData = periods.map((p) => ({
    period: p.label,
    subscribers: Math.round(channel.subscriberCount + dailySubGrowth * p.days),
    views: Math.round(channel.viewCount + dailyViewGrowth * p.days),
    videos: Math.round(channel.videoCount + uploadsPerDay * p.days),
  }));

  // Key milestones
  const nextSubMilestone = [1000, 10000, 100000, 1000000, 10000000, 100000000].find((m) => m > channel.subscriberCount);
  const daysToMilestone = nextSubMilestone && dailySubGrowth > 0 ? Math.ceil((nextSubMilestone - channel.subscriberCount) / dailySubGrowth) : null;

  const projectionCards = [
    {
      icon: Users,
      label: "3-Month Subscribers",
      value: formatNum(Math.round(channel.subscriberCount + dailySubGrowth * 90)),
      change: `+${formatNum(Math.round(dailySubGrowth * 90))}`,
    },
    {
      icon: Eye,
      label: "6-Month Total Views",
      value: formatNum(Math.round(channel.viewCount + dailyViewGrowth * 180)),
      change: `+${formatNum(Math.round(dailyViewGrowth * 180))}`,
    },
    {
      icon: TrendingUp,
      label: "1-Year Subscribers",
      value: formatNum(Math.round(channel.subscriberCount + dailySubGrowth * 365)),
      change: `+${formatNum(Math.round(dailySubGrowth * 365))}`,
    },
    {
      icon: Calendar,
      label: nextSubMilestone ? `Next Milestone (${formatNum(nextSubMilestone)})` : "Growth Rate",
      value: daysToMilestone ? `${daysToMilestone} days` : `${formatNum(Math.round(dailySubGrowth * 30))}/mo`,
      change: daysToMilestone ? `~${Math.round(daysToMilestone / 30)} months` : "steady",
    },
  ];

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 bg-primary rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">Future Projections</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-10 ml-5">
          Linear growth estimates based on channel lifetime averages. Actual growth may vary.
        </p>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {projectionCards.map((c) => (
            <motion.div key={c.label} variants={item} className="stat-card group cursor-default">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-secondary">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-mono text-neon">{c.change}</span>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground mb-1">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-xl p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-foreground">Subscriber Growth Projection</h3>
              <p className="text-xs text-muted-foreground font-mono">Estimated trajectory over 1 year</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 16%)" />
                <XAxis dataKey="period" tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatNum} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="subscribers" stroke="hsl(8, 90%, 60%)" strokeWidth={2} dot={{ fill: "hsl(8, 90%, 60%)", r: 4 }} name="Subscribers" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-xl p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-foreground">Total Views Projection</h3>
              <p className="text-xs text-muted-foreground font-mono">Estimated cumulative views</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 16%)" />
                <XAxis dataKey="period" tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatNum} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="views" stroke="hsl(160, 80%, 55%)" strokeWidth={2} dot={{ fill: "hsl(160, 80%, 55%)", r: 4 }} name="Views" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FutureProjections;
