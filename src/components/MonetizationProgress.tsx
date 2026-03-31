import { motion } from "framer-motion";
import { Users, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ChannelData, VideoData } from "@/hooks/useYouTubeAnalytics";

interface MonetizationProgressProps {
  channel: ChannelData;
  videos: VideoData[];
}

const MonetizationProgress = ({ channel, videos }: MonetizationProgressProps) => {
  const subGoal = 1000;
  const watchHourGoal = 4000;

  const subPercent = Math.min((channel.subscriberCount / subGoal) * 100, 100);
  const isSubMet = channel.subscriberCount >= subGoal;

  // Estimate watch hours from total views (rough: avg view duration ~4 min)
  const estimatedWatchHours = Math.round((channel.viewCount * 4) / 60);
  const watchHourPercent = Math.min((estimatedWatchHours / watchHourGoal) * 100, 100);
  const isWatchMet = estimatedWatchHours >= watchHourGoal;

  const isMonetized = isSubMet && isWatchMet;

  // Growth rate estimation
  const channelAgeDays = Math.max(1, Math.floor((Date.now() - new Date(channel.publishedAt).getTime()) / (1000 * 60 * 60 * 24)));
  const subsPerDay = channel.subscriberCount / channelAgeDays;
  const daysToSubGoal = isSubMet ? 0 : Math.ceil((subGoal - channel.subscriberCount) / Math.max(subsPerDay, 0.01));

  const watchHoursPerDay = estimatedWatchHours / channelAgeDays;
  const daysToWatchGoal = isWatchMet ? 0 : Math.ceil((watchHourGoal - estimatedWatchHours) / Math.max(watchHoursPerDay, 0.01));

  // Est monthly revenue if monetized
  const totalRecentViews = videos.reduce((s, v) => s + v.views, 0);
  const avgViewsPerVideo = videos.length > 0 ? totalRecentViews / videos.length : 0;
  const uploadsPerMonth = (channel.videoCount / channelAgeDays) * 30;
  const estMonthlyRevenue = ((avgViewsPerVideo * uploadsPerMonth) / 1000) * 3;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border/50 bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Monetization Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isMonetized ? (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-neon/10 border border-neon/20">
              <CheckCircle className="w-6 h-6 text-neon" />
              <div>
                <p className="font-semibold text-foreground">✓ Monetized</p>
                <p className="text-sm text-muted-foreground">
                  Est. monthly revenue: ~${Math.round(estMonthlyRevenue).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Subscribers progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-foreground font-medium">Subscribers</span>
                  </div>
                  <span className="font-mono text-muted-foreground">
                    {channel.subscriberCount.toLocaleString()} / {subGoal.toLocaleString()}
                  </span>
                </div>
                <Progress value={subPercent} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{subPercent.toFixed(1)}% complete</span>
                  {!isSubMet && <span>~{daysToSubGoal} days to goal</span>}
                  {isSubMet && <span className="text-neon">✓ Goal met</span>}
                </div>
              </div>

              {/* Watch hours progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neon" />
                    <span className="text-foreground font-medium">Watch Hours</span>
                  </div>
                  <span className="font-mono text-muted-foreground">
                    {estimatedWatchHours.toLocaleString()} / {watchHourGoal.toLocaleString()}
                  </span>
                </div>
                <Progress value={watchHourPercent} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{watchHourPercent.toFixed(1)}% complete</span>
                  {!isWatchMet && <span>~{daysToWatchGoal} days to goal</span>}
                  {isWatchMet && <span className="text-neon">✓ Goal met</span>}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MonetizationProgress;
