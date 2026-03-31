import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useYouTubeConnection } from "./useYouTubeConnection";
import type { YouTubeAnalytics } from "./useYouTubeAnalytics";

interface NicheData {
  niche: string;
  subNiche: string;
  targetAudience: string;
  contentStyle: string;
}

export const useMyChannel = () => {
  const { user, connection } = useYouTubeConnection();
  const [data, setData] = useState<YouTubeAnalytics | null>(null);
  const [nicheData, setNicheData] = useState<NicheData | null>(null);
  const [loading, setLoading] = useState(false);
  const [nicheLoading, setNicheLoading] = useState(false);

  const fetchMyChannel = useCallback(async () => {
    if (!connection?.channel_name) return;
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("youtube-analytics", {
        body: { channelQuery: connection.channel_name },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      setData(result as YouTubeAnalytics);

      // After fetching channel data, detect niche if not already done
      if (user && result?.videos?.length) {
        await detectNiche(result.videos);
      }
    } catch (err) {
      console.error("Failed to fetch own channel:", err);
    } finally {
      setLoading(false);
    }
  }, [connection?.channel_name, user]);

  const detectNiche = async (videos: any[]) => {
    if (!user) return;

    // Check if niche already stored
    const { data: conn } = await supabase
      .from("youtube_connections")
      .select("niche_data")
      .eq("user_id", user.id)
      .maybeSingle();

    if (conn?.niche_data) {
      setNicheData(conn.niche_data as unknown as NicheData);
      return;
    }

    setNicheLoading(true);
    try {
      const videoTitles = videos.slice(0, 20).map((v: any) => v.title);
      const { data: result, error } = await supabase.functions.invoke("niche-detector", {
        body: { videoTitles, videoTags: [] },
      });

      if (error) throw error;
      if (result?.niche) {
        setNicheData(result as NicheData);
        // Store in DB so it only runs once
        await supabase
          .from("youtube_connections")
          .update({ niche_data: result as any })
          .eq("user_id", user.id);
      }
    } catch (err) {
      console.error("Niche detection failed:", err);
    } finally {
      setNicheLoading(false);
    }
  };

  useEffect(() => {
    if (connection?.channel_name) {
      fetchMyChannel();
    }
  }, [connection?.channel_name, fetchMyChannel]);

  return { data, nicheData, loading, nicheLoading, isConnected: !!connection };
};
