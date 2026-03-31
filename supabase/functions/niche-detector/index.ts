import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const { videoTitles, videoTags } = await req.json();

    if (!Array.isArray(videoTitles) || videoTitles.length === 0) {
      return new Response(JSON.stringify({ error: "videoTitles array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Analyze these YouTube video titles and tags and return ONLY a JSON object with: niche (specific, not generic), subNiche, targetAudience, contentStyle (Educational/Entertainment/Lifestyle/Gaming/etc)

Video titles:
${videoTitles.slice(0, 20).join("\n")}

${videoTags?.length ? `Tags: ${videoTags.slice(0, 50).join(", ")}` : ""}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a YouTube niche analysis expert. Return ONLY valid JSON." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_niche",
              description: "Classify a YouTube channel's niche based on video titles and tags",
              parameters: {
                type: "object",
                properties: {
                  niche: { type: "string", description: "Specific niche (e.g. 'React Development', not 'Tech')" },
                  subNiche: { type: "string", description: "Sub-niche within the main niche" },
                  targetAudience: { type: "string", description: "Who the content is for" },
                  contentStyle: { type: "string", enum: ["Educational", "Entertainment", "Lifestyle", "Gaming", "News", "Music", "Sports", "Comedy", "Tutorial", "Review", "Vlog", "Other"] },
                },
                required: ["niche", "subNiche", "targetAudience", "contentStyle"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "classify_niche" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const nicheData = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(nicheData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try to parse content as JSON
    const content = data.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return new Response(jsonMatch[0], {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Could not parse niche data from AI response");
  } catch (err) {
    console.error("niche-detector error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
