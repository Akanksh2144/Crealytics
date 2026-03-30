import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Calendar, Coins } from "lucide-react";
import type { ChannelData, VideoData } from "@/hooks/useYouTubeAnalytics";

const formatCurrency = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
};

interface MonetizationEstimateProps {
  channel: ChannelData;
  videos: VideoData[];
}

const MonetizationEstimate = ({ channel, videos }: MonetizationEstimateProps) => {
  const totalRecentViews = videos.reduce((sum, v) => sum + v.views, 0);
  const avgViewsPerVideo = videos.length > 0 ? totalRecentViews / videos.length : 0;

  // CPM estimates (USD per 1000 views) — industry averages
  const cpmLow = 1.0;
  const cpmMid = 3.0;
  const cpmHigh = 7.0;

  // Estimate monthly views from recent uploads
  const channelAgeDays = Math.max(1, Math.floor((Date.now() - new Date(channel.publishedAt).getTime()) / (1000 * 60 * 60 * 24)));
  const uploadsPerMonth = (channel.videoCount / channelAgeDays) * 30;
  const estMonthlyViews = avgViewsPerVideo * uploadsPerMonth;

  const monthlyLow = (estMonthlyViews / 1000) * cpmLow;
  const monthlyMid = (estMonthlyViews / 1000) * cpmMid;
  const monthlyHigh = (estMonthlyViews / 1000) * cpmHigh;

  const yearlyLow = monthlyLow * 12;
  const yearlyMid = monthlyMid * 12;
  const yearlyHigh = monthlyHigh * 12;

  const estimates = [
    {
      icon: DollarSign,
      label: "Est. Monthly Revenue",
      value: `${formatCurrency(monthlyLow)} – ${formatCurrency(monthlyHigh)}`,
      mid: formatCurrency(monthlyMid),
    },
    {
      icon: Calendar,
      label: "Est. Yearly Revenue",
      value: `${formatCurrency(yearlyLow)} – ${formatCurrency(yearlyHigh)}`,
      mid: formatCurrency(yearlyMid),
    },
    {
      icon: TrendingUp,
      label: "Est. Monthly Views",
      value: estMonthlyViews >= 1_000_000
        ? `${(estMonthlyViews / 1_000_000).toFixed(1)}M`
        : estMonthlyViews >= 1_000
        ? `${(estMonthlyViews / 1_000).toFixed(1)}K`
        : `${Math.round(estMonthlyViews)}`,
      mid: null,
    },
    {
      icon: Coins,
      label: "CPM Range",
      value: `$${cpmLow.toFixed(2)} – $${cpmHigh.toFixed(2)}`,
      mid: `$${cpmMid.toFixed(2)} avg`,
    },
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
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 bg-neon rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">Monetization Estimate</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-10 ml-5">
          Based on industry CPM averages ($1–$7) and recent upload frequency. Actual revenue varies by niche, geography, and ad format.
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {estimates.map((e) => (
            <motion.div key={e.label} variants={item} className="stat-card group cursor-default">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-secondary">
                  <e.icon className="w-5 h-5 text-neon" />
                </div>
              </div>
              <p className="text-xl font-bold font-mono text-foreground mb-1">{e.value}</p>
              {e.mid && <p className="text-xs font-mono text-muted-foreground mb-1">~{e.mid} avg</p>}
              <p className="text-sm text-muted-foreground">{e.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MonetizationEstimate;
