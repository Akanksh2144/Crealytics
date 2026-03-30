import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsGrid from "@/components/StatsGrid";
import PerformanceCharts from "@/components/PerformanceCharts";
import TopVideos from "@/components/TopVideos";
import Footer from "@/components/Footer";

const Index = () => {
  const [searched, setSearched] = useState(false);

  const handleSearch = (query: string) => {
    setSearched(true);
    toast.success(`Analyzing "${query}"...`, {
      description: "Loading channel data",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection onSearch={handleSearch} />
      {searched && (
        <>
          <StatsGrid />
          <PerformanceCharts />
          <TopVideos />
        </>
      )}
      {!searched && (
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
