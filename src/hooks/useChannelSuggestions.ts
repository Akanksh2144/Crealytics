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
        const { data, error } = await supabase.functions.invoke("youtube-analytics", {
          body: { channelQuery: query, action: "suggest" },
        });
        if (!error && data?.suggestions) {
          setSuggestions(data.suggestions);
        }
      } catch {
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
