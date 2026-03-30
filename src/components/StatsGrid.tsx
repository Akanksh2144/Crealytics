import { motion } from "framer-motion";
import { Users, Eye, ThumbsUp, Clock, TrendingUp, Activity } from "lucide-react";
import type { ChannelData, VideoData } from "@/hooks/useYouTubeAnalytics";

const formatNum = (n: number) => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

interface StatsGridProps {
  channel: ChannelData;
  videos: VideoData[];
}

const StatsGrid = ({ channel, videos }: StatsGridProps) => {
  const totalLikes = videos.reduce((sum, v) => sum + v.likes, 0);
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const engagementRate = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : "0";
  const avgViews = videos.length > 0 ? Math.round(totalViews / videos.length) : 0;

  // Calculate days since channel creation
  const channelAge = Math.floor((Date.now() - new Date(channel.publishedAt).getTime()) / (1000 * 60 * 60 * 24));
  const uploadsPerWeek = channelAge > 0 ? ((channel.videoCount / channelAge) * 7).toFixed(1) : "N/A";

  const stats = [
    { icon: Users, label: "Subscribers", value: channel.hiddenSubscriberCount ? "Hidden" : formatNum(channel.subscriberCount) },
    { icon: Eye, label: "Total Views", value: formatNum(channel.viewCount) },
    { icon: ThumbsUp, label: "Engagement Rate", value: `${engagementRate}%` },
    { icon: Activity, label: "Total Videos", value: formatNum(channel.videoCount) },
    { icon: TrendingUp, label: "Avg Views/Video", value: formatNum(avgViews) },
    { icon: Clock, label: "Uploads/Week", value: uploadsPerWeek },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-8 bg-primary rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">Channel Overview</h2>
        </div>
        <div className="flex items-center gap-3 mb-10">
          {channel.thumbnail && (
            <img src={channel.thumbnail} alt={channel.title} className="w-10 h-10 rounded-full" />
          )}
          <div>
            <p className="font-semibold text-foreground">{channel.title}</p>
            {channel.customUrl && (
              <p className="font-mono text-xs text-muted-foreground">{channel.customUrl}</p>
            )}
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={item} className="stat-card group cursor-default">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-secondary">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold font-mono text-foreground mb-1">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsGrid;
