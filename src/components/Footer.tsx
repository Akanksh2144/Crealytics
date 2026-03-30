import { Activity } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/30 py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">TubeMetrics</span>
        </div>
        <p className="text-sm text-muted-foreground font-mono">
          © 2026 TubeMetrics. Channel intelligence, reimagined.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
