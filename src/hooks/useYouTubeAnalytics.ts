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

export interface AdvancedMetrics {
  ter: number;
  acs: number;
  derMin: number;
  derMax: number;
  velocity: number;
  cbi: string;
}

export interface YouTubeAnalytics {
  channel: ChannelData;
  videos: VideoData[];
  advanced: AdvancedMetrics;
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
        const playlistRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`);
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

      // Calculate Advanced Metrics
      let advanced: AdvancedMetrics = { ter: 0, acs: 0, derMin: 0, derMax: 0, velocity: 100, cbi: "Unknown" };
      if (videos.length > 0) {
        const totalViews = videos.reduce((acc, v) => acc + v.views, 0);
        const totalLikes = videos.reduce((acc, v) => acc + v.likes, 0);
        const totalComments = videos.reduce((acc, v) => acc + v.comments, 0);
        
        // 1. TER
        advanced.ter = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;
        
        // 2. ACS
        const avgViews = totalViews / videos.length;
        const subCount = parseInt(channel.statistics.subscriberCount || "0");
        advanced.acs = subCount > 0 ? (avgViews / subCount) * 100 : 0;
        
        // 3. DER
        const baseCpm = 2.5;
        const engagementMultiplier = Math.max(1, advanced.ter / 3); 
        const avgCpm = baseCpm * engagementMultiplier;
        const estimatedRevenue = (totalViews / 1000) * avgCpm;
        advanced.derMin = estimatedRevenue * 0.7;
        advanced.derMax = estimatedRevenue * 1.3;
        
        // 4. Velocity
        if (videos.length >= 10) {
          const last5 = videos.slice(0, 5);
          const prev = videos.slice(5);
          const avgLast5 = last5.reduce((acc, v) => acc + v.views, 0) / 5;
          const avgPrev = prev.reduce((acc, v) => acc + v.views, 0) / prev.length;
          advanced.velocity = avgPrev > 0 ? (avgLast5 / avgPrev) * 100 : 100;
        }
        
        // 5. CBI
        if (videos.length > 1) {
          const intervals = [];
          for (let i = 0; i < videos.length - 1; i++) {
            const d1 = new Date(videos[i].publishedAt).getTime();
            const d2 = new Date(videos[i+1].publishedAt).getTime();
            intervals.push(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
          }
          const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
          const variance = intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length;
          const stdDev = Math.sqrt(variance);
          
          if (stdDev > 14) advanced.cbi = "High Risk";
          else if (stdDev > 7) advanced.cbi = "Medium Risk";
          else advanced.cbi = "Low Risk";
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
        advanced
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchAnalytics };
};
