import { motion } from "framer-motion";
import { Compass, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NicheData {
  niche: string;
  subNiche: string;
  targetAudience: string;
  contentStyle: string;
}

interface NicheDetectionProps {
  nicheData: NicheData | null;
  loading: boolean;
}

const NicheDetection = ({ nicheData, loading }: NicheDetectionProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card className="border-border/50 bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Compass className="w-5 h-5 text-neon" />
            Niche Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing your content niche...
            </div>
          ) : nicheData ? (
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="text-sm px-3 py-1">
                {nicheData.niche}
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {nicheData.subNiche}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                🎯 {nicheData.targetAudience}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                🎬 {nicheData.contentStyle}
              </Badge>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              Upload more videos to detect your niche automatically.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NicheDetection;
