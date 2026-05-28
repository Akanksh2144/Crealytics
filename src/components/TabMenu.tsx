import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { name: "Dashboard", path: "/" },
  { name: "Compare", path: "/compare" },
  { name: "AI Intelligence", path: "/intelligence" },
];

export const TabMenu = () => {
  const location = useLocation();

  return (
    <div className="flex items-center gap-1 p-1.5 rounded-full bg-secondary/50 border border-border/40 backdrop-blur-sm">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-primary rounded-full shadow-sm shadow-primary/20"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
};
