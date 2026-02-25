import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Trash2, Loader2, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/hooks/useOrg";
import { useLocation } from "react-router-dom";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK_PROMPTS = [
  "Give me a clinic summary",
  "Who's coming in today?",
  "Any low inventory alerts?",
  "Show overdue patients",
  "What's our revenue this month?",
  "Show pending lab cases",
  "Find unpaid invoices",
  "Show the waiting list",
];

interface AICopilotPanelProps {
  open: boolean;
  onClose: () => void;
  inline?: boolean;
}

export function AICopilotPanel({ open, onClose, inline = false }: AICopilotPanelProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentOrg } = useOrg();
  const location = useLocation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-copilot", {
        body: {
          messages: updatedMessages,
          orgId: currentOrg?.org_id,
          context: { page: location.pathname },
        },
      });

      if (error) throw error;

      const reply = data?.reply || "Sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      console.error("AI Copilot error:", err);
      let errorMsg = "Failed to reach AI. Please try again.";
      if (err?.message?.includes("429") || err?.context?.status === 429) {
        errorMsg = "Rate limited — please wait a moment and try again.";
      } else if (err?.message?.includes("402") || err?.context?.status === 402) {
        errorMsg = "AI credits exhausted. Please add credits to your Lovable workspace.";
      } else if (err?.message) {
        errorMsg = err.message;
      }
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `⚠️ ${errorMsg}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, currentOrg?.org_id, location.pathname]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const header = (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-transparent shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background bg-emerald-500" />
        </div>
        <div>
          <h3 className="font-semibold text-sm tracking-tight">ClineXus AI</h3>
          <p className="text-[11px] text-muted-foreground font-medium">
            Clinic Assistant · <span className="text-emerald-500">Online</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive" onClick={() => setMessages([])} title="Clear chat">
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
        {!inline && (
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );

  const messagesArea = (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
      {messages.length === 0 && (
        <div className="flex flex-col items-center py-10 space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10"
          >
            <Sparkles className="w-9 h-9 text-primary" />
          </motion.div>
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="text-center space-y-2">
            <p className="font-semibold text-lg">How can I help?</p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
              I can query live clinic data, manage appointments, and provide clinical insights.
            </p>
          </motion.div>
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="w-full grid grid-cols-2 gap-2 pt-2">
            {QUICK_PROMPTS.map((p, i) => (
              <motion.button
                key={p}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.04 }}
                onClick={() => sendMessage(p)}
                className="text-xs text-left px-3 py-2.5 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 text-muted-foreground hover:text-foreground"
              >
                {p}
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
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
          )}
          <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md shadow-sm" : "bg-muted/70 rounded-bl-md border border-border/30"}`}>
            {msg.role === "assistant" ? (
              <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ) : msg.content}
          </div>
        </motion.div>
      ))}

      {isLoading && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Bot className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="bg-muted/70 rounded-2xl rounded-bl-md border border-border/30 px-4 py-3 flex items-center gap-2.5">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-xs text-muted-foreground">Thinking...</span>
          </div>
        </motion.div>
      )}
    </div>
  );

  const inputArea = (
    <div className="border-t border-border p-4 bg-background shrink-0">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="min-h-[44px] max-h-[120px] resize-none text-sm rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors py-3"
            rows={1}
          />
        </div>
        <Button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          size="icon"
          className="shrink-0 h-11 w-11 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-40"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground/50 mt-2 text-center tracking-wide">
        Powered by AI · Always verify clinical suggestions
      </p>
    </div>
  );

  // Inline mode for mobile toggle
  if (inline) {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-background">
        {header}
        {messagesArea}
        {inputArea}
      </div>
    );
  }

  // Desktop: fixed slide-in panel
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35, mass: 0.8 }}
            className="fixed inset-y-0 right-0 z-50 w-full md:w-[420px] lg:w-[460px] flex flex-col bg-background border-l border-border shadow-2xl"
          >
            {header}
            {messagesArea}
            {inputArea}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
