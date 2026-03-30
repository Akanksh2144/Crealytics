import { motion } from "framer-motion";
import { Eye, ThumbsUp, MessageCircle, Clock, TrendingUp } from "lucide-react";

const videos = [
  { title: "Why This Algorithm Change Broke Everything", views: "4.2M", likes: "182K", comments: "8.4K", duration: "18:32", growth: "+340%", thumbnail: "🔴" },
  { title: "I Tested Every AI Tool So You Don't Have To", views: "3.8M", likes: "156K", comments: "12.1K", duration: "24:15", growth: "+280%", thumbnail: "🤖" },
  { title: "The Secret Behind Viral Thumbnails", views: "2.9M", likes: "134K", comments: "6.7K", duration: "12:48", growth: "+195%", thumbnail: "🎨" },
  { title: "How I Grew 1M Subs in 6 Months", views: "2.1M", likes: "98K", comments: "5.2K", duration: "21:07", growth: "+162%", thumbnail: "📈" },
  { title: "Creator Economy: What Nobody Tells You", views: "1.7M", likes: "89K", comments: "4.8K", duration: "16:33", growth: "+128%", thumbnail: "💰" },
  { title: "My Honest Studio Tour 2026", views: "1.4M", likes: "76K", comments: "3.9K", duration: "14:20", growth: "+95%", thumbnail: "🎬" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const TopVideos = () => (
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
        {videos.map((v, i) => (
          <motion.div
            key={v.title}
            variants={item}
            className="glass rounded-xl p-4 md:p-5 flex items-center gap-4 md:gap-6 glass-hover cursor-pointer group"
          >
            {/* Rank */}
            <span className="text-2xl font-bold font-mono text-muted-foreground w-8 text-center">
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Thumbnail placeholder */}
            <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
              {v.thumbnail}
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {v.title}
              </h3>
              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="text-xs font-mono">{v.duration}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm text-foreground">{v.views}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm text-foreground">{v.likes}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm text-foreground">{v.comments}</span>
              </div>
            </div>

            {/* Growth badge */}
            <span className="font-mono text-xs font-semibold px-3 py-1.5 rounded-lg text-neon bg-neon/10 shrink-0">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              {v.growth}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TopVideos;
