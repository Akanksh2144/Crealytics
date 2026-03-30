import { motion } from "framer-motion";
import { Globe, MapPin, Tag, Eye, Users, AlertCircle } from "lucide-react";
import type { ChannelData } from "@/hooks/useYouTubeAnalytics";

interface RankingData {
  sbRank: number | null;
  countryRank: number | null;
  categoryRank: number | null;
  viewsRank: number | null;
  subscribersRank: number | null;
  country: string;
  category: string;
  grade: string;
}

interface ChannelRankingsProps {
  channel: ChannelData;
  rankings: RankingData | null;
  loading?: boolean;
}

const formatRank = (rank: number | null) => {
  if (rank === null) return "—";
  if (rank >= 1_000_000) return `#${(rank / 1_000_000).toFixed(1)}M`;
  if (rank >= 1_000) return `#${(rank / 1_000).toFixed(1)}K`;
  return `#${rank.toLocaleString()}`;
};

const ChannelRankings = ({ channel, rankings, loading }: ChannelRankingsProps) => {
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (!rankings && !loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-2 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl font-bold text-foreground">Global Rankings</h2>
          </div>
          <div className="glass rounded-xl p-8 text-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-mono text-sm">
              Rankings data requires Social Blade API integration.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Connect a Social Blade API key to see SB Rank, Country Rank, Category Rank, and more.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const rankCards = rankings ? [
    { icon: Globe, label: "SB Rank", value: formatRank(rankings.sbRank), color: "text-primary" },
    { icon: MapPin, label: `${rankings.country} Rank`, value: formatRank(rankings.countryRank), color: "text-neon" },
    { icon: Tag, label: `${rankings.category} Rank`, value: formatRank(rankings.categoryRank), color: "text-primary" },
    { icon: Eye, label: "Views Rank", value: formatRank(rankings.viewsRank), color: "text-neon" },
    { icon: Users, label: "Subscribers Rank", value: formatRank(rankings.subscribersRank), color: "text-primary" },
  ] : [];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 bg-primary rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">Global Rankings</h2>
        </div>
        {rankings && (
          <p className="text-sm text-muted-foreground mb-10 ml-5">
            Grade: <span className="font-mono text-neon font-bold">{rankings.grade}</span> · {rankings.country} · {rankings.category}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="stat-card animate-pulse">
                <div className="w-10 h-10 bg-secondary rounded-lg mb-4" />
                <div className="h-8 bg-secondary rounded mb-2 w-20" />
                <div className="h-4 bg-secondary rounded w-24" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {rankCards.map((c) => (
              <motion.div key={c.label} variants={item} className="stat-card group cursor-default">
                <div className="p-2.5 rounded-lg bg-secondary mb-4 w-fit">
                  <c.icon className={`w-5 h-5 ${c.color}`} />
                </div>
                <p className="text-2xl font-bold font-mono text-foreground mb-1">{c.value}</p>
                <p className="text-sm text-muted-foreground">{c.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ChannelRankings;
