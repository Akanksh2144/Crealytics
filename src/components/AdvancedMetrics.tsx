import { motion } from "framer-motion";
import { Zap, Target, DollarSign, Rocket, AlertTriangle, ShieldCheck, Activity } from "lucide-react";
import type { AdvancedMetrics as AdvMetricsType } from "@/hooks/useYouTubeAnalytics";

interface Props {
  data: AdvMetricsType;
}

const formatCurrency = (n: number) => {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${Math.round(n)}`;
};

const AdvancedMetrics = ({ data }: Props) => {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const getVelocityColor = (v: number) => {
    if (v >= 120) return "text-neon";
    if (v <= 80) return "text-destructive";
    return "text-yellow-400";
  };

  const getCbiColor = (cbi: string) => {
    if (cbi === "High Risk") return "text-destructive bg-destructive/10 border-destructive/20";
    if (cbi === "Medium Risk") return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-neon bg-neon/10 border-neon/20";
  };

  const getCbiIcon = (cbi: string) => {
    if (cbi === "High Risk" || cbi === "Medium Risk") return <AlertTriangle className="w-4 h-4" />;
    return <ShieldCheck className="w-4 h-4" />;
  };

  return (
    <section className="py-10 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-2 h-8 bg-neon rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">TubeMetrics Pro Intelligence</h2>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-neon/10 text-neon border border-neon/20 ml-2">
            PRO
          </span>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {/* TER */}
          <motion.div variants={item} className="glass rounded-xl p-6 relative overflow-hidden group border-border/50 hover:border-primary/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">True Engagement Rate (TER)</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-bold font-mono">{data.ter.toFixed(2)}%</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                Calculated directly from likes & comments over the last 50 videos. 
              </p>
            </div>
          </motion.div>

          {/* ACS */}
          <motion.div variants={item} className="glass rounded-xl p-6 relative overflow-hidden group border-border/50 hover:border-blue-500/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Target className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Audience Conversion Score</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-bold font-mono">{data.acs.toFixed(1)}%</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                Percentage of subscribers who return to watch recent uploads.
              </p>
            </div>
          </motion.div>

          {/* Revenue */}
          <motion.div variants={item} className="glass rounded-xl p-6 relative overflow-hidden group border-border/50 hover:border-green-500/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Dynamic Est. Revenue (Last 50)</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold font-mono text-green-400">
                  {formatCurrency(data.derMin)} - {formatCurrency(data.derMax)}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                Scaled algorithmically using your TER to adjust base CPMs.
              </p>
            </div>
          </motion.div>

          {/* Velocity */}
          <motion.div variants={item} className="glass rounded-xl p-6 relative overflow-hidden group border-border/50 hover:border-purple-500/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Rocket className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Velocity Score</p>
              <div className="flex items-baseline gap-2">
                <h3 className={`text-4xl font-bold font-mono ${getVelocityColor(data.velocity)}`}>
                  {data.velocity.toFixed(0)}%
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                Measures current momentum (last 5 videos vs previous). {">"}100% is accelerating.
              </p>
            </div>
          </motion.div>

          {/* CBI */}
          <motion.div variants={item} className="glass rounded-xl p-6 relative overflow-hidden group border-border/50 hover:border-orange-500/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-orange-500/10">
                  <Activity className="w-6 h-6 text-orange-500" />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getCbiColor(data.cbi)}`}>
                  {getCbiIcon(data.cbi)}
                  {data.cbi}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Creator Burnout Index (CBI)</p>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                Analyzes upload consistency and schedule variance to predict creator fatigue and algorithmic penalty risks.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AdvancedMetrics;
