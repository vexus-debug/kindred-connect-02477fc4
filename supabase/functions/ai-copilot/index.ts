import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are ClineXus AI — the intelligent copilot embedded in a dental clinic management dashboard. You assist dentists, clinic staff, and managers.

Your capabilities:
1. **Data Queries**: You can look up real clinic data — patients, appointments, invoices, inventory, staff — using the tools provided.
2. **Actions**: You can create appointments, add clinical notes, and register patients using tools.
3. **Smart Alerts**: You can check inventory levels, find overdue patients, and surface insights.
4. **Clinical Notes (SOAP)**: Generate structured S/O/A/P notes.
5. **Diagnosis Suggestions**: Based on symptoms, suggest possible diagnoses with confidence levels.
6. **Treatment Plan Advice**: Recommend treatment sequences and priorities.

Guidelines:
- Be concise and professional. Use bullet points and headers.
- When generating SOAP notes, use: **S:** / **O:** / **A:** / **P:**
- When suggesting diagnoses, list with confidence levels (likely, possible, unlikely).
- Always clarify when something requires clinical judgment.
- Use tools proactively when the user asks about data. Don't say "I can't access data" — use the tools!
- After performing actions, confirm what was done with key details.
- Format responses in markdown.`;

// Tool definitions for Gemini function calling
const TOOLS = [
  {
    function_declarations: [
      {
        name: "search_patients",
        description: "Search for patients by name, phone, or email. Use this when the user asks about a specific patient or wants to find patients.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search term (name, phone, or email)" },
            limit: { type: "integer", description: "Max results to return (default 10)" },
          },
          required: ["query"],
        },
      },
      {
        name: "get_todays_appointments",
        description: "Get today's appointments with patient and staff details. Use when user asks about today's schedule, who's coming in, or the day's workload.",
        parameters: {
          type: "object",
          properties: {
            status: { type: "string", description: "Filter by status: scheduled, completed, cancelled, no_show. Leave empty for all." },
          },
        },
      },
      {
        name: "get_appointment_stats",
        description: "Get appointment statistics for a date range. Use when user asks about appointment volume, no-show rates, or scheduling patterns.",
        parameters: {
          type: "object",
          properties: {
            start_date: { type: "string", description: "Start date (YYYY-MM-DD). Defaults to 30 days ago." },
            end_date: { type: "string", description: "End date (YYYY-MM-DD). Defaults to today." },
          },
        },
      },
      {
        name: "get_revenue_summary",
        description: "Get revenue summary from invoices for a period. Use when user asks about income, revenue, billing, or financial performance.",
        parameters: {
          type: "object",
          properties: {
            start_date: { type: "string", description: "Start date (YYYY-MM-DD)" },
            end_date: { type: "string", description: "End date (YYYY-MM-DD)" },
          },
        },
      },
      {
        name: "check_low_inventory",
        description: "Check inventory items that are at or below minimum stock levels. Use when user asks about supplies, stock alerts, or inventory status.",
        parameters: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_overdue_patients",
        description: "Find patients who haven't had an appointment in a specified number of days. Use for follow-up reminders or patient retention.",
        parameters: {
          type: "object",
          properties: {
            days: { type: "integer", description: "Number of days since last appointment (default 90)" },
          },
        },
      },
      {
        name: "get_patient_history",
        description: "Get a patient's appointment history, clinical notes, and treatment details. Use when discussing a specific patient's care.",
        parameters: {
          type: "object",
          properties: {
            patient_id: { type: "string", description: "Patient UUID" },
          },
          required: ["patient_id"],
        },
      },
      {
        name: "create_appointment",
        description: "Book a new appointment for a patient. Use when the user wants to schedule a visit.",
        parameters: {
          type: "object",
          properties: {
            patient_id: { type: "string", description: "Patient UUID" },
            staff_id: { type: "string", description: "Dentist/staff UUID" },
            appointment_date: { type: "string", description: "Date (YYYY-MM-DD)" },
            appointment_time: { type: "string", description: "Time (HH:MM)" },
            treatment_id: { type: "string", description: "Optional treatment UUID" },
            notes: { type: "string", description: "Appointment notes" },
          },
          required: ["patient_id", "staff_id", "appointment_date", "appointment_time"],
        },
      },
      {
        name: "create_clinical_note",
        description: "Create a SOAP clinical note for a patient. Use when the user wants to save clinical notes.",
        parameters: {
          type: "object",
          properties: {
            patient_id: { type: "string", description: "Patient UUID" },
            appointment_id: { type: "string", description: "Optional appointment UUID" },
            subjective: { type: "string", description: "Subjective findings" },
            objective: { type: "string", description: "Objective findings" },
            assessment: { type: "string", description: "Assessment/diagnosis" },
            plan: { type: "string", description: "Treatment plan" },
          },
          required: ["patient_id", "subjective", "assessment", "plan"],
        },
      },
      {
        name: "get_pending_invoices",
        description: "Get unpaid/overdue invoices. Use when user asks about outstanding payments or collections.",
        parameters: {
          type: "object",
          properties: {
            status: { type: "string", description: "Invoice status filter: draft, sent, overdue, paid. Default: shows unpaid." },
          },
        },
      },
      {
        name: "get_staff_list",
        description: "Get the list of staff/dentists. Use when the user needs to find a dentist for booking or asks about the team.",
        parameters: {
          type: "object",
          properties: {
            role: { type: "string", description: "Filter by role: dentist, hygienist, receptionist, etc." },
          },
        },
      },
      {
        name: "get_clinic_summary",
        description: "Get a comprehensive clinic dashboard summary including patient count, today's appointments, pending invoices, and low inventory alerts. Use when user asks for an overview or summary.",
        parameters: {
          type: "object",
          properties: {},
        },
      },
    ],
  },
];

// Tool execution functions
async function executeTool(name: string, args: any, supabaseAdmin: any, orgId: string) {
  const today = new Date().toISOString().split("T")[0];

  switch (name) {
    case "search_patients": {
      const limit = args.limit || 10;
      const q = `%${args.query}%`;
      const { data, error } = await supabaseAdmin
        .from("patients")
        .select("id, first_name, last_name, phone, email, gender, date_of_birth, status, allergies, medical_history")
        .eq("org_id", orgId)
        .or(`first_name.ilike.${q},last_name.ilike.${q},phone.ilike.${q},email.ilike.${q}`)
        .limit(limit);
      if (error) throw error;
      return data?.length ? data : "No patients found matching that search.";
    }

    case "get_todays_appointments": {
      let query = supabaseAdmin
        .from("appointments")
        .select("id, appointment_date, appointment_time, status, notes, chair, is_walk_in, patient_id, staff_id")
        .eq("org_id", orgId)
        .eq("appointment_date", today)
        .order("appointment_time");
      if (args.status) query = query.eq("status", args.status);
      const { data: appts, error } = await query;
      if (error) throw error;
      if (!appts?.length) return "No appointments scheduled for today.";

      // Fetch patient and staff names
      const patientIds = [...new Set(appts.map((a: any) => a.patient_id))];
      const staffIds = [...new Set(appts.map((a: any) => a.staff_id))];

      const [{ data: patients }, { data: staff }] = await Promise.all([
        supabaseAdmin.from("patients").select("id, first_name, last_name").in("id", patientIds),
        supabaseAdmin.from("staff").select("id, full_name").in("id", staffIds),
      ]);

      const patientMap = Object.fromEntries((patients || []).map((p: any) => [p.id, `${p.first_name} ${p.last_name}`]));
      const staffMap = Object.fromEntries((staff || []).map((s: any) => [s.id, s.full_name]));

      return appts.map((a: any) => ({
        time: a.appointment_time,
        patient: patientMap[a.patient_id] || "Unknown",
        dentist: staffMap[a.staff_id] || "Unknown",
        status: a.status,
        chair: a.chair,
        notes: a.notes,
        is_walk_in: a.is_walk_in,
      }));
    }

    case "get_appointment_stats": {
      const startDate = args.start_date || new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
      const endDate = args.end_date || today;
      const { data, error } = await supabaseAdmin
        .from("appointments")
        .select("status")
        .eq("org_id", orgId)
        .gte("appointment_date", startDate)
        .lte("appointment_date", endDate);
      if (error) throw error;
      const total = data?.length || 0;
      const stats: Record<string, number> = {};
      (data || []).forEach((a: any) => { stats[a.status] = (stats[a.status] || 0) + 1; });
      return { period: `${startDate} to ${endDate}`, total, breakdown: stats, no_show_rate: total ? `${((stats["no_show"] || 0) / total * 100).toFixed(1)}%` : "0%" };
    }

    case "get_revenue_summary": {
      const startDate = args.start_date || new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
      const endDate = args.end_date || today;
      const { data, error } = await supabaseAdmin
        .from("invoices")
        .select("total, status, payment_method")
        .eq("org_id", orgId)
        .gte("invoice_date", startDate)
        .lte("invoice_date", endDate);
      if (error) throw error;
      const totalRevenue = (data || []).filter((i: any) => i.status === "paid").reduce((sum: number, i: any) => sum + Number(i.total), 0);
      const pending = (data || []).filter((i: any) => i.status !== "paid" && i.status !== "cancelled").reduce((sum: number, i: any) => sum + Number(i.total), 0);
      return { period: `${startDate} to ${endDate}`, total_invoices: data?.length || 0, collected: totalRevenue, pending, by_method: {} };
    }

    case "check_low_inventory": {
      const { data, error } = await supabaseAdmin
        .from("inventory")
        .select("name, quantity, min_stock, unit, category, expiry_date")
        .eq("org_id", orgId)
        .order("quantity");
      if (error) throw error;
      const lowStock = (data || []).filter((i: any) => i.quantity <= i.min_stock);
      const expiringSoon = (data || []).filter((i: any) => {
        if (!i.expiry_date) return false;
        const diff = (new Date(i.expiry_date).getTime() - Date.now()) / 86400000;
        return diff <= 30 && diff >= 0;
      });
      return { low_stock_items: lowStock.length ? lowStock : "All items above minimum stock levels.", expiring_within_30_days: expiringSoon.length ? expiringSoon : "No items expiring soon." };
    }

    case "get_overdue_patients": {
      const days = args.days || 90;
      const cutoff = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
      // Get patients with their last appointment
      const { data: patients, error } = await supabaseAdmin
        .from("patients")
        .select("id, first_name, last_name, phone, email, status")
        .eq("org_id", orgId)
        .eq("status", "active");
      if (error) throw error;
      if (!patients?.length) return "No active patients found.";

      const { data: recentAppts } = await supabaseAdmin
        .from("appointments")
        .select("patient_id, appointment_date")
        .eq("org_id", orgId)
        .gte("appointment_date", cutoff);

      const recentPatientIds = new Set((recentAppts || []).map((a: any) => a.patient_id));
      const overdue = patients.filter((p: any) => !recentPatientIds.has(p.id)).slice(0, 20);
      return overdue.length ? { count: overdue.length, days_threshold: days, patients: overdue.map((p: any) => ({ name: `${p.first_name} ${p.last_name}`, phone: p.phone, email: p.email })) } : `All active patients have visited within the last ${days} days.`;
    }

    case "get_patient_history": {
      const [{ data: patient }, { data: appointments }, { data: notes }] = await Promise.all([
        supabaseAdmin.from("patients").select("*").eq("id", args.patient_id).single(),
        supabaseAdmin.from("appointments").select("appointment_date, appointment_time, status, notes").eq("patient_id", args.patient_id).eq("org_id", orgId).order("appointment_date", { ascending: false }).limit(10),
        supabaseAdmin.from("clinical_notes").select("subjective, objective, assessment, plan, created_at").eq("patient_id", args.patient_id).eq("org_id", orgId).order("created_at", { ascending: false }).limit(5),
      ]);
      return { patient: patient || "Patient not found", recent_appointments: appointments || [], recent_notes: notes || [] };
    }

    case "create_appointment": {
      const { data, error } = await supabaseAdmin
        .from("appointments")
        .insert({
          org_id: orgId,
          patient_id: args.patient_id,
          staff_id: args.staff_id,
          appointment_date: args.appointment_date,
          appointment_time: args.appointment_time,
          treatment_id: args.treatment_id || null,
          notes: args.notes || null,
          status: "scheduled",
        })
        .select()
        .single();
      if (error) throw error;
      return { success: true, appointment_id: data.id, message: `Appointment booked for ${args.appointment_date} at ${args.appointment_time}` };
    }

    case "create_clinical_note": {
      const { data, error } = await supabaseAdmin
        .from("clinical_notes")
        .insert({
          org_id: orgId,
          patient_id: args.patient_id,
          appointment_id: args.appointment_id || null,
          subjective: args.subjective,
          objective: args.objective || null,
          assessment: args.assessment,
          plan: args.plan,
        })
        .select()
        .single();
      if (error) throw error;
      return { success: true, note_id: data.id, message: "Clinical note saved successfully." };
    }

    case "get_pending_invoices": {
      let query = supabaseAdmin
        .from("invoices")
        .select("id, invoice_number, invoice_date, due_date, total, status, patient_id")
        .eq("org_id", orgId)
        .order("due_date");
      if (args.status) {
        query = query.eq("status", args.status);
      } else {
        query = query.in("status", ["draft", "sent", "overdue"]);
      }
      const { data, error } = await query.limit(20);
      if (error) throw error;
      if (!data?.length) return "No pending invoices found.";
      const patientIds = [...new Set(data.map((i: any) => i.patient_id).filter(Boolean))];
      const { data: patients } = patientIds.length
        ? await supabaseAdmin.from("patients").select("id, first_name, last_name").in("id", patientIds)
        : { data: [] };
      const pMap = Object.fromEntries((patients || []).map((p: any) => [p.id, `${p.first_name} ${p.last_name}`]));
      return data.map((i: any) => ({ invoice: i.invoice_number, patient: pMap[i.patient_id] || "N/A", total: i.total, status: i.status, due_date: i.due_date }));
    }

    case "get_staff_list": {
      let query = supabaseAdmin.from("staff").select("id, full_name, role, specialty, phone, email, status").eq("org_id", orgId).eq("status", "active").order("full_name");
      if (args.role) query = query.eq("role", args.role);
      const { data, error } = await query;
      if (error) throw error;
      return data?.length ? data : "No staff members found.";
    }

    case "get_clinic_summary": {
      const [
        { count: patientCount },
        { data: todayAppts },
        { data: pendingInvoices },
        { data: lowStock },
      ] = await Promise.all([
        supabaseAdmin.from("patients").select("*", { count: "exact", head: true }).eq("org_id", orgId).eq("status", "active"),
        supabaseAdmin.from("appointments").select("status").eq("org_id", orgId).eq("appointment_date", today),
        supabaseAdmin.from("invoices").select("total, status").eq("org_id", orgId).in("status", ["draft", "sent", "overdue"]),
        supabaseAdmin.from("inventory").select("name, quantity, min_stock").eq("org_id", orgId),
      ]);
      const lowItems = (lowStock || []).filter((i: any) => i.quantity <= i.min_stock);
      const pendingTotal = (pendingInvoices || []).reduce((s: number, i: any) => s + Number(i.total), 0);
      const apptBreakdown: Record<string, number> = {};
      (todayAppts || []).forEach((a: any) => { apptBreakdown[a.status] = (apptBreakdown[a.status] || 0) + 1; });

      return {
        active_patients: patientCount || 0,
        todays_appointments: { total: todayAppts?.length || 0, breakdown: apptBreakdown },
        pending_invoices: { count: pendingInvoices?.length || 0, total_amount: pendingTotal },
        inventory_alerts: lowItems.length,
      };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context, orgId } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase admin client for data queries
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    if (!orgId) {
      return new Response(JSON.stringify({ error: "Organization ID is required" }), {
        status: 400,
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
    }
    systemPrompt += `\n\nToday's date: ${new Date().toISOString().split("T")[0]}`;

    // Convert messages to Gemini format
    const geminiContents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    // Non-streaming for tool calling loop
    let currentContents = [...geminiContents];
    let maxToolRounds = 5;

    while (maxToolRounds-- > 0) {
      const geminiBody = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: currentContents,
        tools: TOOLS,
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      };

      let response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiBody),
      });

      if (response.status === 429) {
        await new Promise((r) => setTimeout(r, 2000));
        response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiBody),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error:", response.status, errorText);
        const userMsg = response.status === 429
          ? "AI is temporarily rate-limited. Please wait a moment and try again."
          : `AI error: ${response.status}`;
        return new Response(JSON.stringify({ error: userMsg }), {
          status: response.status === 429 ? 429 : 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const result = await response.json();
      const candidate = result.candidates?.[0];
      if (!candidate) {
        return new Response(JSON.stringify({ error: "No response from AI" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const parts = candidate.content?.parts || [];
      const functionCalls = parts.filter((p: any) => p.functionCall);

      if (functionCalls.length === 0) {
        // No tool calls — return the text response
        const textContent = parts.map((p: any) => p.text || "").join("");
        return new Response(JSON.stringify({ reply: textContent }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Execute tool calls
      currentContents.push({ role: "model", parts });

      const toolResults: any[] = [];
      for (const fc of functionCalls) {
        const { name, args } = fc.functionCall;
        console.log(`Executing tool: ${name}`, args);
        try {
          const result = await executeTool(name, args || {}, supabaseAdmin, orgId);
          toolResults.push({
            functionResponse: {
              name,
              response: { result: typeof result === "string" ? result : JSON.stringify(result) },
            },
          });
        } catch (e) {
          console.error(`Tool ${name} error:`, e);
          toolResults.push({
            functionResponse: {
              name,
              response: { error: e instanceof Error ? e.message : "Tool execution failed" },
            },
          });
        }
      }

      currentContents.push({ role: "user", parts: toolResults });
    }

    return new Response(JSON.stringify({ reply: "I ran out of steps processing your request. Please try a simpler query." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-copilot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
