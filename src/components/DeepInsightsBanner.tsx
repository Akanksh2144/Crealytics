import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConnectYouTubeModal from "@/components/ConnectYouTubeModal";

const lockedFeatures = [
  { title: "AI Weekly Action Plan", desc: "5 personalized tasks every Monday based on your real data" },
  { title: "Watch Hour Tracker", desc: "See exactly how far you are from 4,000 hours" },
  { title: "Audience Retention Analysis", desc: "Find where viewers drop off in each video" },
  { title: "Revenue Intelligence", desc: "Real earnings, RPM trends, best videos by revenue" },
  { title: "Script Hook Analyzer", desc: "Paste your intro, get a hook strength score" },
  { title: "Thumbnail AI Feedback", desc: "Upload your thumbnail, get CTR improvement tips" },
];

const DeepInsightsBanner = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Premium Insights
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Unlock Your Personal Growth Coach
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              Connect your YouTube channel to get AI-powered recommendations based on your real
              private data — watch hours, audience retention, revenue, and more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {lockedFeatures.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative rounded-xl border border-border/50 bg-card p-5 text-left overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-muted-foreground/60" />
                  <span className="font-semibold text-sm text-foreground">{f.title}</span>
                </div>
                <p className="text-sm text-muted-foreground blur-[5px] select-none pointer-events-none">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <Button
            size="lg"
            onClick={() => setModalOpen(true)}
            className="font-semibold text-base px-8"
          >
            Connect YouTube for Free →
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Read-only access · No posting on your behalf · Cancel anytime
          </p>
        </div>
      </section>
      <ConnectYouTubeModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};

export default DeepInsightsBanner;
