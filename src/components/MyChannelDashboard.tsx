import { motion } from "framer-motion";
import { User, Loader2 } from "lucide-react";
import StatsGrid from "@/components/StatsGrid";
import PerformanceCharts from "@/components/PerformanceCharts";
import TopVideos from "@/components/TopVideos";
import MonetizationEstimate from "@/components/MonetizationEstimate";
import DailyAnalytics from "@/components/DailyAnalytics";
import FutureProjections from "@/components/FutureProjections";
import ChannelRankings from "@/components/ChannelRankings";
import MonetizationProgress from "@/components/MonetizationProgress";
import NicheDetection from "@/components/NicheDetection";
import type { YouTubeAnalytics } from "@/hooks/useYouTubeAnalytics";

interface MyChannelDashboardProps {
  data: YouTubeAnalytics;
  nicheData: { niche: string; subNiche: string; targetAudience: string; contentStyle: string } | null;
  nicheLoading: boolean;
}

const MyChannelDashboard = ({ data, nicheData, nicheLoading }: MyChannelDashboardProps) => {
  return (
    <section className="pt-8">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Channel</h2>
            <p className="text-sm text-muted-foreground">Your personal analytics dashboard</p>
          </div>
        </motion.div>

        {/* Logged-in only cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <MonetizationProgress channel={data.channel} videos={data.videos} />
          <NicheDetection nicheData={nicheData} loading={nicheLoading} />
        </div>
      </div>

      {/* Reuse all existing analytics components */}
      <StatsGrid channel={data.channel} videos={data.videos} />
      <ChannelRankings channel={data.channel} rankings={null} />
      <MonetizationEstimate channel={data.channel} videos={data.videos} />
      <PerformanceCharts videos={data.videos} />
      <DailyAnalytics videos={data.videos} />
      <FutureProjections channel={data.channel} videos={data.videos} />
      <TopVideos videos={data.videos} />
    </section>
  );
};

export default MyChannelDashboard;
