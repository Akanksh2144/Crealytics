import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, ArrowLeftRight, Users, Eye, ThumbsUp, Activity, TrendingUp, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useYouTubeAnalytics, type YouTubeAnalytics } from "@/hooks/useYouTubeAnalytics";
import { useChannelSuggestions } from "@/hooks/useChannelSuggestions";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

const formatNum = (n: number) => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass rounded-lg px-4 py-3 shadow-xl border border-border">
      <p className="font-mono text-xs text-muted-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="font-mono text-sm" style={{ color: p.color }}>
          {p.name}: {formatNum(p.value)}
        </p>
      ))}
    </div>
  );
};

const SearchInput = ({ onSearch, loading, label }: { onSearch: (q: string) => void; loading: boolean; label: string }) => {
  const [q, setQ] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, fetchSuggestions, clearSuggestions } = useChannelSuggestions();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim() && !loading) {
      setShowSuggestions(false);
      clearSuggestions();
      onSearch(q.trim());
    }
  };

  const handleSelect = (title: string) => {
    setQ(title);
    setShowSuggestions(false);
    clearSuggestions();
    onSearch(title);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQ(val);
    fetchSuggestions(val);
    setShowSuggestions(true);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex-1 relative" ref={wrapperRef}>
      <label className="text-xs font-mono text-muted-foreground mb-2 block">{label}</label>
      <div className="relative flex items-center glass rounded-xl overflow-hidden">
        <Search className="w-4 h-4 text-muted-foreground ml-3" />
        <input
          value={q}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Channel name..."
          className="flex-1 bg-transparent px-3 py-3 text-foreground placeholder:text-muted-foreground outline-none font-mono text-sm"
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 font-semibold text-xs transition-colors disabled:opacity-50 flex items-center gap-1">
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          {loading ? "..." : "Go"}
        </button>
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute left-0 right-0 top-full mt-2 glass rounded-xl overflow-x-hidden overflow-y-auto z-50 max-h-[300px] shadow-2xl custom-scrollbar"
          >
            {suggestions.map((s) => (
              <button
                key={s.channelId}
                type="button"
                onClick={() => handleSelect(s.title)}
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-secondary/60 transition-colors"
              >
                {s.thumbnail && (
                  <img src={s.thumbnail} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full shrink-0 object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{s.title}</p>
                    {s.subscriberCount && (
                      <p className="text-xs font-semibold text-emerald-500 whitespace-nowrap bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {parseInt(s.subscriberCount).toLocaleString()} subs
                      </p>
                    )}
                  </div>
                  {s.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{s.description}</p>
                  )}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

const StatRow = ({ icon: Icon, label, val1, val2 }: { icon: any; label: string; val1: string; val2: string }) => (
  <div className="flex items-center gap-4 py-3 border-b border-border/30 last:border-0">
    <div className="flex items-center gap-2 w-40">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <span className="flex-1 text-right font-mono text-sm text-foreground font-semibold">{val1}</span>
    <span className="w-8 text-center text-xs text-muted-foreground">vs</span>
    <span className="flex-1 text-left font-mono text-sm text-foreground font-semibold">{val2}</span>
  </div>
);

const Compare = () => {
  const ch1 = useYouTubeAnalytics();
  const ch2 = useYouTubeAnalytics();

  const handleSearch1 = async (q: string) => {
    toast.success(`Analyzing "${q}"...`);
    await ch1.fetchAnalytics(q);
  };
  const handleSearch2 = async (q: string) => {
    toast.success(`Analyzing "${q}"...`);
    await ch2.fetchAnalytics(q);
  };

  const bothLoaded = ch1.data && ch2.data;

  // Prepare comparison chart data
  const comparisonData = bothLoaded ? [
    { metric: "Subscribers", ch1: ch1.data.channel.subscriberCount, ch2: ch2.data.channel.subscriberCount },
    { metric: "Total Views", ch1: ch1.data.channel.viewCount, ch2: ch2.data.channel.viewCount },
    { metric: "Videos", ch1: ch1.data.channel.videoCount, ch2: ch2.data.channel.videoCount },
  ] : [];

  // Engagement comparison
  const getEngagement = (d: YouTubeAnalytics) => {
    const totalLikes = d.videos.reduce((s, v) => s + v.likes, 0);
    const totalViews = d.videos.reduce((s, v) => s + v.views, 0);
    return totalViews > 0 ? (totalLikes / totalViews) * 100 : 0;
  };

  const getAvgViews = (d: YouTubeAnalytics) => {
    const totalViews = d.videos.reduce((s, v) => s + v.views, 0);
    return d.videos.length > 0 ? Math.round(totalViews / d.videos.length) : 0;
  };

  // Radar chart data for normalized comparison
  const radarData = bothLoaded ? (() => {
    const d1 = ch1.data!;
    const d2 = ch2.data!;
    const maxSubs = Math.max(d1.channel.subscriberCount, d2.channel.subscriberCount) || 1;
    const maxViews = Math.max(d1.channel.viewCount, d2.channel.viewCount) || 1;
    const maxVideos = Math.max(d1.channel.videoCount, d2.channel.videoCount) || 1;
    const maxEng = Math.max(getEngagement(d1), getEngagement(d2)) || 1;
    const maxAvg = Math.max(getAvgViews(d1), getAvgViews(d2)) || 1;
    return [
      { metric: "Subscribers", ch1: (d1.channel.subscriberCount / maxSubs) * 100, ch2: (d2.channel.subscriberCount / maxSubs) * 100 },
      { metric: "Total Views", ch1: (d1.channel.viewCount / maxViews) * 100, ch2: (d2.channel.viewCount / maxViews) * 100 },
      { metric: "Videos", ch1: (d1.channel.videoCount / maxVideos) * 100, ch2: (d2.channel.videoCount / maxVideos) * 100 },
      { metric: "Engagement", ch1: (getEngagement(d1) / maxEng) * 100, ch2: (getEngagement(d2) / maxEng) * 100 },
      { metric: "Avg Views", ch1: (getAvgViews(d1) / maxAvg) * 100, ch2: (getAvgViews(d2) / maxAvg) * 100 },
    ];
  })() : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-10">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Channel <span className="text-gradient">Comparison</span>
            </h1>
            <p className="text-muted-foreground mb-10">Compare two YouTube channels side by side</p>

            <div className="flex flex-col md:flex-row items-end gap-4 mb-10">
              <SearchInput onSearch={handleSearch1} loading={ch1.loading} label="Channel 1" />
              <ArrowLeftRight className="w-5 h-5 text-muted-foreground shrink-0 mb-3" />
              <SearchInput onSearch={handleSearch2} loading={ch2.loading} label="Channel 2" />
            </div>
          </motion.div>

          {(ch1.error || ch2.error) && (
            <p className="text-destructive font-mono text-sm mb-6">{ch1.error || ch2.error}</p>
          )}

          {/* Channel headers */}
          {(ch1.data || ch2.data) && (
            <div className="flex items-center gap-4 mb-10">
              {ch1.data && (
                <div className="flex-1 glass rounded-xl p-4 flex items-center gap-3">
                  {ch1.data.channel.thumbnail && <img src={ch1.data.channel.thumbnail} alt="" className="w-12 h-12 rounded-full" />}
                  <div>
                    <p className="font-semibold text-foreground">{ch1.data.channel.title}</p>
                    <p className="text-xs font-mono text-muted-foreground">{ch1.data.channel.customUrl}</p>
                  </div>
                </div>
              )}
              {ch2.data && (
                <div className="flex-1 glass rounded-xl p-4 flex items-center gap-3">
                  {ch2.data.channel.thumbnail && <img src={ch2.data.channel.thumbnail} alt="" className="w-12 h-12 rounded-full" />}
                  <div>
                    <p className="font-semibold text-foreground">{ch2.data.channel.title}</p>
                    <p className="text-xs font-mono text-muted-foreground">{ch2.data.channel.customUrl}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Side by side stats */}
          {bothLoaded && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Stats Comparison</h3>
                <StatRow icon={Users} label="Subscribers" val1={formatNum(ch1.data!.channel.subscriberCount)} val2={formatNum(ch2.data!.channel.subscriberCount)} />
                <StatRow icon={Eye} label="Total Views" val1={formatNum(ch1.data!.channel.viewCount)} val2={formatNum(ch2.data!.channel.viewCount)} />
                <StatRow icon={Activity} label="Total Videos" val1={formatNum(ch1.data!.channel.videoCount)} val2={formatNum(ch2.data!.channel.videoCount)} />
                <StatRow icon={ThumbsUp} label="Engagement" val1={`${getEngagement(ch1.data!).toFixed(1)}%`} val2={`${getEngagement(ch2.data!).toFixed(1)}%`} />
                <StatRow icon={TrendingUp} label="Avg Views" val1={formatNum(getAvgViews(ch1.data!))} val2={formatNum(getAvgViews(ch2.data!))} />
                <StatRow icon={Clock} label="Channel Age" val1={`${Math.floor((Date.now() - new Date(ch1.data!.channel.publishedAt).getTime()) / (1000 * 60 * 60 * 24 * 365))}y`} val2={`${Math.floor((Date.now() - new Date(ch2.data!.channel.publishedAt).getTime()) / (1000 * 60 * 60 * 24 * 365))}y`} />
              </div>

              {/* Bar comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Metrics Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 16%)" />
                      <XAxis dataKey="metric" tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatNum} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="ch1" fill="hsl(8, 90%, 60%)" radius={[4, 4, 0, 0]} name={ch1.data!.channel.title} />
                      <Bar dataKey="ch2" fill="hsl(160, 80%, 55%)" radius={[4, 4, 0, 0]} name={ch2.data!.channel.title} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="glass rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Radar Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(240, 10%, 16%)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 11 }} />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <Radar name={ch1.data!.channel.title} dataKey="ch1" stroke="hsl(8, 90%, 60%)" fill="hsl(8, 90%, 60%)" fillOpacity={0.2} />
                      <Radar name={ch2.data!.channel.title} dataKey="ch2" stroke="hsl(160, 80%, 55%)" fill="hsl(160, 80%, 55%)" fillOpacity={0.2} />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {!ch1.data && !ch2.data && !ch1.loading && !ch2.loading && (
            <div className="py-20 text-center">
              <p className="text-muted-foreground font-mono text-sm">Search for two channels above to compare them</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Compare;
