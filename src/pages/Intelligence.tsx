import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AICoach from "@/components/AICoach";
import KeywordExplorer from "@/components/KeywordExplorer";
import { motion } from "framer-motion";
import { Brain, Sparkles, Target, Zap } from "lucide-react";

const Intelligence = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Creator <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Intelligence</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl"
          >
            Supercharge your channel with AI-driven insights, keyword opportunities, and automated content strategy generation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <KeywordExplorer />
          </div>
          <div className="space-y-8">
            <AICoach />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Intelligence;
