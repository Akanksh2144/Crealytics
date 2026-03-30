import { motion } from "framer-motion";
import { Users, Eye, ThumbsUp, Clock, TrendingUp, Activity } from "lucide-react";

const stats = [
  { icon: Users, label: "Subscribers", value: "2.4M", change: "+12.3%", up: true },
  { icon: Eye, label: "Total Views", value: "847M", change: "+8.7%", up: true },
  { icon: ThumbsUp, label: "Engagement Rate", value: "6.8%", change: "+2.1%", up: true },
  { icon: Clock, label: "Avg Watch Time", value: "8:42", change: "-0.5%", up: false },
  { icon: TrendingUp, label: "Growth Rate", value: "3.2%", change: "+1.4%", up: true },
  { icon: Activity, label: "Upload Frequency", value: "4.2/wk", change: "+0.8", up: true },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const StatsGrid = () => (
  <section className="py-20">
    <div className="container mx-auto px-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-2 h-8 bg-primary rounded-full" />
        <h2 className="text-2xl font-bold text-foreground">Channel Overview</h2>
        <span className="font-mono text-xs text-muted-foreground ml-auto">Last 30 days</span>
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
              <span className={`font-mono text-xs font-semibold px-2 py-1 rounded-md ${
                s.up ? "text-neon bg-neon/10" : "text-destructive bg-destructive/10"
              }`}>
                {s.change}
              </span>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground mb-1">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default StatsGrid;
