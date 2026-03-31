import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface YouTubeConnection {
  channel_id: string | null;
  channel_name: string | null;
  channel_thumbnail: string | null;
}

export const useYouTubeConnection = () => {
  const [user, setUser] = useState<User | null>(null);
  const [connection, setConnection] = useState<YouTubeConnection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          // Check for existing connection
          const { data } = await supabase
            .from("youtube_connections")
            .select("channel_id, channel_name, channel_thumbnail")
            .eq("user_id", session.user.id)
            .maybeSingle();

          if (data) {
            setConnection(data);
          } else {
            // New sign-in — extract provider info and store connection
            const meta = session.user.user_metadata;
            const newConn: YouTubeConnection = {
              channel_id: null,
              channel_name: meta?.full_name ?? meta?.name ?? session.user.email ?? "Connected",
              channel_thumbnail: meta?.avatar_url ?? null,
            };

            await supabase.from("youtube_connections").upsert({
              user_id: session.user.id,
              channel_name: newConn.channel_name,
              channel_thumbnail: newConn.channel_thumbnail,
              access_token: session.provider_token ?? null,
              refresh_token: session.provider_refresh_token ?? null,
              scopes: "youtube.readonly,yt-analytics.readonly",
            });

            setConnection(newConn);
          }
        } else {
          setConnection(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const disconnect = async () => {
    await supabase.auth.signOut();
    setConnection(null);
    setUser(null);
  };

  return { user, connection, loading, disconnect };
};
