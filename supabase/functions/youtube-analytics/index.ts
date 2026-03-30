import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "YouTube API key not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { channelQuery, action } = await req.json();

    // Handle search suggestions
    if (action === "suggest") {
      if (!channelQuery || typeof channelQuery !== "string" || channelQuery.length < 2 || channelQuery.length > 200) {
        return new Response(JSON.stringify({ suggestions: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const suggestUrl = `${YOUTUBE_API_BASE}/search?part=snippet&type=channel&q=${encodeURIComponent(channelQuery)}&maxResults=5&key=${apiKey}`;
      const suggestRes = await fetch(suggestUrl);
      const suggestData = await suggestRes.json();
      if (!suggestRes.ok || !suggestData.items?.length) {
        return new Response(JSON.stringify({ suggestions: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const suggestions = suggestData.items.map((item: any) => ({
        channelId: item.snippet.channelId,
        title: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.default?.url || "",
        description: item.snippet.description?.slice(0, 100) || "",
      }));
      return new Response(JSON.stringify({ suggestions }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!channelQuery || typeof channelQuery !== "string" || channelQuery.length > 200) {
      return new Response(JSON.stringify({ error: "Invalid channel query" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 1: Search for the channel
    const searchUrl = `${YOUTUBE_API_BASE}/search?part=snippet&type=channel&q=${encodeURIComponent(channelQuery)}&maxResults=1&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchRes.ok) {
      return new Response(JSON.stringify({ error: "YouTube API error", details: searchData }), {
        status: searchRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!searchData.items?.length) {
      return new Response(JSON.stringify({ error: "Channel not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const channelId = searchData.items[0].snippet.channelId;

    // Step 2: Get channel details (statistics + snippet + brandingSettings)
    const channelUrl = `${YOUTUBE_API_BASE}/channels?part=snippet,statistics,brandingSettings,contentDetails&id=${channelId}&key=${apiKey}`;
    const channelRes = await fetch(channelUrl);
    const channelData = await channelRes.json();

    if (!channelRes.ok || !channelData.items?.length) {
      return new Response(JSON.stringify({ error: "Failed to fetch channel details" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const channel = channelData.items[0];
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

    // Step 3: Get recent videos from uploads playlist
    let videos: any[] = [];
    if (uploadsPlaylistId) {
      const playlistUrl = `${YOUTUBE_API_BASE}/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=20&key=${apiKey}`;
      const playlistRes = await fetch(playlistUrl);
      const playlistData = await playlistRes.json();

      if (playlistRes.ok && playlistData.items?.length) {
        const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId).join(",");

        // Step 4: Get video statistics
        const videosUrl = `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`;
        const videosRes = await fetch(videosUrl);
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

    const result = {
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
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
