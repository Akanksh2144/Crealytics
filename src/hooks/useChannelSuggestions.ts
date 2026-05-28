import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ChannelSuggestion {
  channelId: string;
  title: string;
  thumbnail: string;
  description: string;
}

export const useChannelSuggestions = () => {
  const [suggestions, setSuggestions] = useState<ChannelSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchSuggestions = (query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        if (!apiKey) throw new Error("Missing YouTube API Key");
        
        const suggestUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=5&key=${apiKey}`;
        const suggestRes = await fetch(suggestUrl);
        const suggestData = await suggestRes.json();
        
        if (suggestRes.ok && suggestData.items?.length) {
          const formattedSuggestions = suggestData.items.map((item: any) => ({
            channelId: item.snippet.channelId,
            title: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails?.default?.url || "",
            description: item.snippet.description?.slice(0, 100) || "",
          }));
          setSuggestions(formattedSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        // silently fail suggestions
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const clearSuggestions = () => setSuggestions([]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { suggestions, loading, fetchSuggestions, clearSuggestions };
};
