import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, Zap, BarChart3, Loader2 } from "lucide-react";
import { useChannelSuggestions } from "@/hooks/useChannelSuggestions";

const HeroSection = ({ onSearch, loading }: { onSearch: (query: string) => void; loading?: boolean }) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, fetchSuggestions, clearSuggestions } = useChannelSuggestions();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      setShowSuggestions(false);
      clearSuggestions();
      onSearch(query.trim());
    }
  };

  const handleSelect = (title: string) => {
    setQuery(title);
    setShowSuggestions(false);
    clearSuggestions();
    onSearch(title);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-x-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-neon/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
          >
            <Zap className="w-4 h-4 text-neon" />
            <span className="text-sm font-mono text-muted-foreground">Real-time channel intelligence</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Decode Your</span>
            <br />
            <span className="text-gradient">YouTube Growth</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Terminal-grade analytics for creators who take their channel seriously. 
            Uncover hidden patterns, predict trends, and outperform the algorithm.
          </p>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-16">
            <div className="relative group" ref={wrapperRef}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-neon/50 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center glass rounded-xl overflow-hidden">
                <Search className="w-5 h-5 text-muted-foreground ml-4" />
                <input
                  type="text"
                  value={query}
                  onChange={handleChange}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Enter channel name or URL..."
                  className="flex-1 bg-transparent px-4 py-4 text-foreground placeholder:text-muted-foreground outline-none font-mono text-sm"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 font-semibold text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? "Analyzing..." : "Analyze"}
                </button>
              </div>

              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute left-0 right-0 top-full mt-2 glass rounded-xl overflow-x-hidden overflow-y-auto z-50 max-h-[400px] shadow-2xl custom-scrollbar"
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
            </div>
          </form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {[
              { icon: BarChart3, label: "Channels Analyzed", value: "2.4M+" },
              { icon: TrendingUp, label: "Data Points", value: "18B+" },
              { icon: Zap, label: "Avg Response", value: "<2s" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <stat.icon className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="text-xl font-bold font-mono text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
