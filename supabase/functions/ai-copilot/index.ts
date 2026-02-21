import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are ClineXus AI — the intelligent copilot embedded in a dental clinic management dashboard. You assist dentists, clinic staff, and managers.

Your capabilities:
1. **Clinical Notes (SOAP)**: Generate structured Subjective, Objective, Assessment, Plan notes from appointment/patient data.
2. **Diagnosis Suggestions**: Based on symptoms, findings, or dental chart data, suggest possible diagnoses and next steps.
3. **Treatment Plan Advice**: Recommend treatment sequences, priorities, and cost estimates.
4. **Screen Context Awareness**: When given context about what the user is currently viewing (patients list, appointments, invoices, etc.), proactively suggest helpful actions.
5. **General Dental Knowledge**: Answer clinical questions, drug interactions, material recommendations, and best practices.

Guidelines:
- Be concise and professional.
- Use bullet points and headers for readability.
- When generating SOAP notes, always use the format: **S:** / **O:** / **A:** / **P:**
- When suggesting diagnoses, list them with confidence levels (likely, possible, unlikely).
- Always clarify when something requires clinical judgment — you are an assistant, not a replacement for professional diagnosis.
- If the user shares page context, acknowledge it and offer relevant suggestions.
- Format responses in markdown.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build context-enhanced system prompt
    let systemPrompt = SYSTEM_PROMPT;
    if (context) {
      systemPrompt += `\n\n--- CURRENT SCREEN CONTEXT ---\nThe user is currently viewing: ${context.page || "unknown page"}\n`;
      if (context.data) {
        systemPrompt += `Relevant data on screen:\n${JSON.stringify(context.data, null, 2)}\n`;
      }
      systemPrompt += `Use this context to provide relevant, proactive suggestions when appropriate.`;
    }

    // Convert messages to Gemini format
    const geminiContents = [];
    
    // Add system instruction as first user message context
    for (const msg of messages) {
      geminiContents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;
    const geminiBody = JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: geminiContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    let response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: geminiBody,
    });

    // Retry once after a delay if rate limited
    if (response.status === 429) {
      console.log("Rate limited, retrying after 2s...");
      await new Promise((r) => setTimeout(r, 2000));
      response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: geminiBody,
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      const userMsg = response.status === 429
        ? "AI is temporarily rate-limited. Please wait a moment and try again."
        : `Gemini API error: ${response.status}`;
      return new Response(JSON.stringify({ error: userMsg }), {
        status: response.status === 429 ? 429 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream the response back
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-copilot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
