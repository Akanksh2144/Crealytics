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
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      if (!apiKey) throw new Error("Missing YouTube API Key");

      // Step 1: Search
      const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(channelQuery)}&maxResults=1&key=${apiKey}`);
      const searchData = await searchRes.json();
      if (!searchRes.ok || !searchData.items?.length) throw new Error("Channel not found");
      const channelId = searchData.items[0].snippet.channelId;

      // Step 2: Channel Details
      const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&id=${channelId}&key=${apiKey}`);
      const channelData = await channelRes.json();
      if (!channelRes.ok || !channelData.items?.length) throw new Error("Failed to fetch channel details");
      const channel = channelData.items[0];
      const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

      // Step 3 & 4: Videos
      let videos: any[] = [];
      if (uploadsPlaylistId) {
        const playlistRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=20&key=${apiKey}`);
        const playlistData = await playlistRes.json();
        if (playlistRes.ok && playlistData.items?.length) {
          const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId).join(",");
          const videosRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`);
          const videosData = await videosRes.json();
          if (videosRes.ok && videosData.items) {
            videos = videosData.items.map((v: any) => ({
              id: v.id,
              title: v.snippet.title,
              publishedAt: v.snippet.publishedAt,
              thumbnail: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url,
              views: parseInt(v.statistics.viewCount || "0"),
              likes: parseInt(v.statistics.likeCount || "0"),
              comments: parseInt(v.statistics.commentCount || "0"),
              duration: v.contentDetails.duration,
            }));
          }
        }
      }

      setData({
        channel: {
          id: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          customUrl: channel.snippet.customUrl,
          publishedAt: channel.snippet.publishedAt,
          thumbnail: channel.snippet.thumbnails?.medium?.url || channel.snippet.thumbnails?.default?.url,
          subscriberCount: parseInt(channel.statistics.subscriberCount || "0"),
          viewCount: parseInt(channel.statistics.viewCount || "0"),
          videoCount: parseInt(channel.statistics.videoCount || "0"),
          hiddenSubscriberCount: channel.statistics.hiddenSubscriberCount,
        },
        videos,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchAnalytics };
};
