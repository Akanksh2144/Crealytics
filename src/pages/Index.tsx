import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsGrid from "@/components/StatsGrid";
import PerformanceCharts from "@/components/PerformanceCharts";
import TopVideos from "@/components/TopVideos";
import MonetizationEstimate from "@/components/MonetizationEstimate";
import DailyAnalytics from "@/components/DailyAnalytics";
import FutureProjections from "@/components/FutureProjections";
import ChannelRankings from "@/components/ChannelRankings";
import Footer from "@/components/Footer";
import DeepInsightsBanner from "@/components/DeepInsightsBanner";
import { useYouTubeAnalytics } from "@/hooks/useYouTubeAnalytics";

const Index = () => {
  const { data, loading, error, fetchAnalytics } = useYouTubeAnalytics();

  const handleSearch = async (query: string) => {
    toast.success(`Analyzing "${query}"...`, {
      description: "Fetching real channel data from YouTube",
    });
    await fetchAnalytics(query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection onSearch={handleSearch} loading={loading} />
      {error && (
        <section className="py-10 text-center">
          <p className="text-destructive font-mono text-sm">{error}</p>
        </section>
      )}
      {data && (
        <>
          <StatsGrid channel={data.channel} videos={data.videos} />
          <ChannelRankings channel={data.channel} rankings={null} />
          <MonetizationEstimate channel={data.channel} videos={data.videos} />
          <PerformanceCharts videos={data.videos} />
          <DailyAnalytics videos={data.videos} />
          <FutureProjections channel={data.channel} videos={data.videos} />
          <TopVideos videos={data.videos} />
          <DeepInsightsBanner />
        </>
      )}
      {!data && !loading && !error && (
        <section className="py-20 text-center">
          <p className="text-muted-foreground font-mono text-sm">
            Enter a channel name above to see the analytics dashboard
          </p>
        </section>
      )}
      <Footer />
    </div>
  );
};

export default Index;
