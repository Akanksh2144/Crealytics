import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ChannelData {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  thumbnail: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  hiddenSubscriberCount: boolean;
}

export interface VideoData {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
}

export interface YouTubeAnalytics {
  channel: ChannelData;
  videos: VideoData[];
}

export const useYouTubeAnalytics = () => {
  const [data, setData] = useState<YouTubeAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (channelQuery: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        "youtube-analytics",
        { body: { channelQuery } }
      );

      if (fnError) {
        throw new Error(fnError.message || "Failed to fetch analytics");
      }

      if (result?.error) {
        throw new Error(result.error);
      }

      setData(result as YouTubeAnalytics);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchAnalytics };
};
