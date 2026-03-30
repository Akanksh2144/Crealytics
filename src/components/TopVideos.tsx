import { motion } from "framer-motion";
import { Eye, ThumbsUp, MessageCircle, Clock, ExternalLink } from "lucide-react";
import type { VideoData } from "@/hooks/useYouTubeAnalytics";

const formatNum = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

// Parse ISO 8601 duration (PT1H2M3S) to readable format
const parseDuration = (iso: string) => {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return iso;
  const h = match[1] ? `${match[1]}:` : "";
  const m = match[2] || "0";
  const s = (match[3] || "0").padStart(2, "0");
  return `${h}${h ? m.padStart(2, "0") : m}:${s}`;
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const TopVideos = ({ videos }: { videos: VideoData[] }) => {
  const sorted = [...videos].sort((a, b) => b.views - a.views);

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-2 h-8 bg-primary rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">Top Performing Videos</h2>
          <span className="font-mono text-xs text-muted-foreground ml-auto">Ranked by views</span>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-3"
        >
          {sorted.map((v, i) => (
            <motion.a
              key={v.id}
              href={`https://youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              variants={item}
              className="glass rounded-xl p-4 md:p-5 flex items-center gap-4 md:gap-6 glass-hover cursor-pointer group block"
            >
              <span className="text-2xl font-bold font-mono text-muted-foreground w-8 text-center">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="w-14 h-14 rounded-lg bg-secondary shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                {v.thumbnail ? (
                  <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {v.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-mono">{parseDuration(v.duration)}</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm text-foreground">{formatNum(v.views)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm text-foreground">{formatNum(v.likes)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm text-foreground">{formatNum(v.comments)}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TopVideos;
