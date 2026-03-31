import { useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ConnectYouTubeModal from "@/components/ConnectYouTubeModal";
import { useYouTubeConnection } from "@/hooks/useYouTubeConnection";

const Navbar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { connection, loading } = useYouTubeConnection();

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30"
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">TubeMetrics</span>
            <span className="font-mono text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">BETA</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/compare" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Compare</Link>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Trends</a>

            {!loading && connection ? (
              <div className="flex items-center gap-2.5 bg-secondary/60 rounded-full pl-1 pr-3 py-1">
                <div className="relative">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={connection.channel_thumbnail ?? undefined} />
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {(connection.channel_name ?? "Y")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background animate-pulse" />
                </div>
                <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                  {connection.channel_name}
                </span>
              </div>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Connect YouTube
              </button>
            )}
          </div>
        </div>
      </motion.nav>
      <ConnectYouTubeModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};

export default Navbar;
