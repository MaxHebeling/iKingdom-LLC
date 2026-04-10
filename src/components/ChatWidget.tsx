"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const INITIAL_GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi — I'm Channel, the iKingdom Assistant. I can answer any question about how we automate businesses, our investment tiers, our process, or whether we're a fit for you. What would you like to know?",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) {
      // Delay focus until slide-up animation completes
      const t = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Drop the initial canned greeting from what we send to the model;
          // it's purely UI chrome.
          messages: nextMessages.filter(
            (m) => !(m.role === "assistant" && m.content === INITIAL_GREETING.content)
          ),
        }),
      });

      const data = (await res.json()) as { content?: string; error?: string };

      if (!res.ok || data.error) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content || "" },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble reaching the iKingdom servers right now. Please try again in a moment, or submit the application form below and our team will follow up directly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating action button */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? "Close Channel" : "Open Channel — iKingdom Assistant"}
        className="fixed bottom-24 right-6 z-[60] hidden h-[68px] w-[68px] items-center justify-center rounded-full bg-[var(--color-bg-elevated)] transition-transform sm:flex"
        style={{
          boxShadow:
            "0 14px 36px rgba(36,28,14,0.32), 0 0 0 2px rgba(201,169,110,0.55), 0 0 0 4px rgba(36,28,14,0.08)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[var(--color-fg)] text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="avatar"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative h-[60px] w-[60px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assistant.jpg"
                alt="Channel — iKingdom Assistant"
                className="h-[60px] w-[60px] rounded-full object-cover"
              />
              {/* Online indicator */}
              <span
                aria-hidden
                className="absolute bottom-0 right-0 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[var(--color-bg-elevated)]"
              >
                <span className="h-[10px] w-[10px] rounded-full bg-[#4ade80] shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-44 right-6 z-[59] hidden w-[400px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-[var(--color-line-strong)] bg-[var(--color-bg-card)] text-[var(--color-fg)] shadow-[0_40px_90px_rgba(36,28,14,0.22)] sm:flex"
            style={{ height: "min(600px, calc(100vh - 14rem))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-line-strong)] bg-[var(--color-bg-elevated)] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assistant.jpg"
                    alt="Channel"
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-[#c9a96e]/60"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-0 right-0 flex h-[10px] w-[10px] items-center justify-center rounded-full bg-[var(--color-bg-elevated)]"
                  >
                    <span className="h-[7px] w-[7px] rounded-full bg-[#4ade80]" />
                  </span>
                </div>
                <div>
                  <div className="font-display text-base font-semibold leading-none text-[var(--color-fg)]">
                    Channel
                  </div>
                  <div className="mt-1 text-[11px] font-medium leading-none text-[var(--color-fg-muted)]">
                    iKingdom Assistant
                  </div>
                  <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
                    Online · Always available
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-line)] hover:text-[var(--color-fg)]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto bg-[var(--color-bg-card)] px-5 py-5"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex items-end gap-2 ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role === "assistant" && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/assistant.jpg"
                      alt="Channel"
                      className="h-7 w-7 flex-shrink-0 rounded-full object-cover ring-1 ring-[#c9a96e]/50"
                    />
                  )}
                  <div
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[14px] font-medium leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#d4b37a] text-[var(--color-fg)] shadow-[0_4px_12px_rgba(201,169,110,0.35)]"
                        : "border border-[var(--color-line-strong)] bg-[var(--color-bg-elevated)] text-[var(--color-fg)]"
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-end justify-start gap-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assistant.jpg"
                    alt="Channel"
                    className="h-7 w-7 flex-shrink-0 rounded-full object-cover ring-1 ring-[#c9a96e]/50"
                  />
                  <div className="flex items-center gap-1.5 rounded-2xl border border-[var(--color-line-strong)] bg-[var(--color-bg-elevated)] px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c9a96e] [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c9a96e] [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c9a96e]" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-[var(--color-line-strong)] bg-[var(--color-bg-elevated)] px-4 py-3">
              {error && (
                <div className="mb-2 text-[11px] font-medium text-[#b8954f]">{error}</div>
              )}
              <div className="flex items-end gap-2 rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-bg-card)] px-3 py-2 transition-colors focus-within:border-[#c9a96e]">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask about our process, pricing, or fit..."
                  disabled={loading}
                  className="max-h-32 flex-1 resize-none bg-transparent text-[14px] font-medium text-[var(--color-fg)] placeholder:text-[var(--color-fg-muted)] placeholder:font-normal focus:outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-fg)] text-white transition-all hover:bg-[#c9a96e] hover:text-[var(--color-fg)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-[var(--color-fg)] disabled:hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
                Powered by Claude · Anthropic
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
