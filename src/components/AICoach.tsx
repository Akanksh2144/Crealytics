import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const AICoach = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ title: string; score: number }[] | null>(null);

  const handleGenerate = () => {
    if (!topic) return;
    setLoading(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setSuggestions([
        { title: `I tried ${topic} for 30 days (Shocking Results)`, score: 92 },
        { title: `The Ultimate Guide to ${topic} in 2024`, score: 88 },
        { title: `Stop doing this if you want to master ${topic}`, score: 95 },
      ]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="glass rounded-2xl p-6 border border-border/50 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold">AI Content Coach</h3>
          <p className="text-sm text-muted-foreground">Generate high-CTR titles</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div>
          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a video topic..."
              className="w-full bg-secondary/30 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <Button 
              size="icon"
              className="absolute right-1 top-1 h-10 w-10 rounded-lg bg-indigo-600 hover:bg-indigo-700"
              onClick={handleGenerate}
              disabled={loading || !topic}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {suggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 mt-6"
          >
            <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">Generated Titles</h4>
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/30 hover:border-indigo-500/30 transition-colors">
                <span className="text-sm font-medium">{s.title}</span>
                <div className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                  <Zap className="w-3 h-3" /> {s.score}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AICoach;
