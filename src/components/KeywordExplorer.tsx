import { useState } from "react";
import { Search, TrendingUp, AlertCircle, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const KeywordExplorer = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    // Mock Data for vidIQ style keyword analysis
    setResults({
      keyword: query,
      volume: 85, // 0-100
      competition: 20, // 0-100
      overall: 78,
      related: [
        { word: `${query} tutorial 2024`, score: 82 },
        { word: `how to use ${query}`, score: 75 },
        { word: `${query} for beginners`, score: 90 }
      ]
    });
  };

  return (
    <div className="glass rounded-2xl p-6 border border-border/50 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
          <Search className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Keyword Explorer</h3>
          <p className="text-sm text-muted-foreground">Discover high-volume, low-competition tags</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords (e.g. 'react nextjs')..."
            className="w-full bg-secondary/30 border border-border/50 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </form>

      {results ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-secondary/20 border border-border/30 text-center">
              <div className="text-sm text-muted-foreground mb-1">Search Volume</div>
              <div className="text-3xl font-bold text-emerald-400">{results.volume}/100</div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/20 border border-border/30 text-center">
              <div className="text-sm text-muted-foreground mb-1">Competition</div>
              <div className="text-3xl font-bold text-amber-400">{results.competition}/100</div>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20"><BarChart3 className="w-12 h-12 text-primary" /></div>
              <div className="text-sm text-primary/80 mb-1 font-medium">Overall Score</div>
              <div className="text-4xl font-black text-primary">{results.overall}</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Related Opportunities
            </h4>
            <div className="space-y-2">
              {results.related.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 hover:bg-secondary/30 transition-colors">
                  <span className="text-sm">{item.word}</span>
                  <span className="text-xs font-bold px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded">
                    Score: {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center text-muted-foreground/50">
          <BarChart3 className="w-12 h-12 mb-2 opacity-50" />
          <p className="text-sm">Search for a keyword to analyze its potential</p>
        </div>
      )}
    </div>
  );
};

export default KeywordExplorer;
