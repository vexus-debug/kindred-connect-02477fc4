import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOrg } from "@/hooks/useOrg";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const PAGE_CONTEXT_MAP: Record<string, string> = {
  "/dashboard": "Dashboard Home — overview with stats, today's schedule, revenue charts",
  "/dashboard/patients": "Patients List — viewing all registered patients",
  "/dashboard/appointments": "Appointments — managing scheduled appointments",
  "/dashboard/treatments": "Treatments — available treatment catalog",
  "/dashboard/billing": "Invoices & Billing — patient invoices",
  "/dashboard/inventory": "Inventory — dental supplies and stock management",
  "/dashboard/staff": "Staff Management — team members and roles",
  "/dashboard/prescriptions": "Prescriptions — patient medication records",
  "/dashboard/dental-charts": "Dental Charts — patient dental charting",
  "/dashboard/lab-work": "Lab Work — lab orders sent to external labs",
  "/dashboard/lab": "Lab Dashboard — internal lab case management",
  "/dashboard/reports": "Reports & Analytics — clinic performance reports",
  "/dashboard/waiting-list": "Waiting List — patient queue management",
  "/dashboard/schedules": "Schedules — dentist availability and scheduling",
  "/dashboard/settings": "Clinic Settings — configuration and preferences",
  "/dashboard/expenses": "Expenses — clinic expense tracking",
  "/dashboard/payment-plans": "Payment Plans — installment payment management",
  "/dashboard/estimates": "Treatment Estimates — patient quotes",
  "/dashboard/consent-forms": "Consent Forms — patient consent management",
  "/dashboard/documents": "Documents — clinic document management",
  "/dashboard/reviews": "Reviews — patient feedback and ratings",
  "/dashboard/commissions": "Commissions — staff commission payouts",
  "/dashboard/suppliers": "Suppliers — supplier management",
  "/dashboard/purchase-orders": "Purchase Orders — supply ordering",
  "/dashboard/treatment-materials": "Treatment Materials — materials linked to treatments",
  "/dashboard/automation": "Automation — automated workflows",
  "/dashboard/profitability": "Profitability — profit analysis",
  "/dashboard/messages": "Messages — internal messaging",
  "/dashboard/notifications": "Notifications — alerts and notifications",
};

const QUICK_PROMPTS = [
  "Give me a clinic summary",
  "Who's coming in today?",
  "Any low inventory alerts?",
  "Show overdue patients needing follow-up",
  "What's our revenue this month?",
  "Show pending lab cases",
  "Find unpaid invoices",
  "Show the waiting list",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-copilot`;

// Cute robot SVG component
function RobotIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Antenna */}
      <circle cx="32" cy="6" r="4" fill="currentColor" opacity="0.7" />
      <rect x="30" y="8" width="4" height="10" rx="2" fill="currentColor" opacity="0.5" />
      {/* Head */}
      <rect x="12" y="16" width="40" height="28" rx="8" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5" />
      {/* Eyes */}
      <circle cx="24" cy="30" r="5" fill="currentColor" />
      <circle cx="40" cy="30" r="5" fill="currentColor" />
      <circle cx="25.5" cy="28.5" r="1.8" fill="white" />
      <circle cx="41.5" cy="28.5" r="1.8" fill="white" />
      {/* Mouth */}
      <rect x="24" y="38" width="16" height="3" rx="1.5" fill="currentColor" opacity="0.5" />
      {/* Body */}
      <rect x="18" y="46" width="28" height="14" rx="5" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2" />
      {/* Arms */}
      <rect x="6" y="48" width="10" height="4" rx="2" fill="currentColor" opacity="0.4" />
      <rect x="48" y="48" width="10" height="4" rx="2" fill="currentColor" opacity="0.4" />
      {/* Chest light */}
      <circle cx="32" cy="53" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="32" cy="53" r="1.5" fill="white" opacity="0.8" />
    </svg>
  );
}

export function AICopilot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const location = useLocation();
  const { currentOrg } = useOrg();

  const currentPage = Object.entries(PAGE_CONTEXT_MAP).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || location.pathname;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          context: { page: currentPage },
          orgId: currentOrg?.org_id,
        }),
      });

      if (!resp.ok) {
        throw new Error("maintenance");
      }

      const data = await resp.json();
      if (data.error) {
        throw new Error("maintenance");
      }

      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "I couldn't generate a response." }]);
    } catch (e) {
      console.error("AI Copilot error:", e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Hey! Your assistant AI is currently having a routine upgrade/maintenance. Check back later! 🛠️" },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, currentPage, currentOrg?.org_id]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={() => setOpen(true)}
              className="group relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 shadow-[0_8px_32px_-4px_hsl(var(--primary)/0.5)] hover:shadow-[0_12px_40px_-2px_hsl(var(--primary)/0.6)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
            >
              <RobotIcon size={32} className="text-primary-foreground drop-shadow-sm" />
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-2xl animate-ping bg-primary/20 pointer-events-none" style={{ animationDuration: '3s' }} />
              {/* Status dot */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-background shadow-sm" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100dvh-6rem)] rounded-3xl shadow-[0_24px_80px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden backdrop-blur-xl bg-background/95 border border-border/50"
          >
            {/* Header */}
            <div className="relative px-5 py-4 border-b border-border/50 bg-gradient-to-r from-primary/8 via-primary/4 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                      <RobotIcon size={24} className="text-primary-foreground" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm tracking-tight">ClineXus AI</h3>
                    <p className="text-[11px] text-muted-foreground font-medium">Clinic Assistant · Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                    onClick={() => setMessages([])}
                    title="Clear chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl hover:bg-muted transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
              {messages.length === 0 && (
                <div className="flex flex-col items-center py-8 space-y-5">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10"
                  >
                    <RobotIcon size={44} className="text-primary" />
                  </motion.div>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-1.5"
                  >
                    <p className="font-semibold text-base">Hello! I'm your AI assistant</p>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-[260px]">
                      I can query live clinic data, manage appointments, and provide clinical insights.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-full space-y-2 pt-1"
                  >
                    {QUICK_PROMPTS.map((p, i) => (
                      <motion.button
                        key={p}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.35 + i * 0.05 }}
                        onClick={() => sendMessage(p)}
                        className="w-full text-xs text-left px-4 py-2.5 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors shrink-0" />
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{p}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <RobotIcon size={16} className="text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md shadow-sm"
                        : "bg-muted/70 rounded-bl-md border border-border/30"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <RobotIcon size={16} className="text-primary" />
                  </div>
                  <div className="bg-muted/70 rounded-2xl rounded-bl-md border border-border/30 px-4 py-3 flex items-center gap-2.5">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border/50 p-3 bg-background/80 backdrop-blur-sm">
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="min-h-[44px] max-h-[120px] resize-none text-sm rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors pr-3 py-3"
                    rows={1}
                  />
                </div>
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="shrink-0 h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-40"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-2 text-center font-medium tracking-wide">
                Powered by AI · Always verify clinical suggestions
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}