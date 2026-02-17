import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import {
  fetchMessages,
  sendMessage,
  subscribeMessages,
  type Message,
} from "../lib/supabase";
import { generateUsername, getStoredUsername, storeUsername } from "../lib/username";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [lastSent, setLastSent] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = getStoredUsername();
    if (stored) setUsername(stored);
  }, []);

  const confirmUsername = (name?: string) => {
    const final = name?.trim() || generateUsername();
    storeUsername(final);
    setUsername(final);
  };

  useEffect(() => {
    if (!open || !username) return;

    let cancelled = false;

    fetchMessages().then((msgs) => {
      if (!cancelled) setMessages(msgs);
    });

    const unsub = subscribeMessages((msg) => {
      if (!cancelled) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === msg.id);
          if (exists) return prev;
          return [...prev.slice(-49), msg];
        });
      }
    });

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [open, username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!username || !draft.trim() || sending) return;
    const now = Date.now();
    if (now - lastSent < 2000) return;

    const text = draft.trim();
    setDraft("");
    setLastSent(now);
    setSending(true);

    await sendMessage(username, text);
    setSending(false);
  }, [username, draft, sending, lastSent]);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center
                   rounded-full bg-primary-500 text-white shadow-lg transition-transform
                   hover:scale-105 active:scale-95"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-5 z-50 flex h-[26rem] w-80 flex-col overflow-hidden
                       rounded-xl border border-neutral-200 bg-white shadow-xl
                       dark:border-neutral-700 dark:bg-neutral-900 sm:w-96"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Global Chat
              </span>
              {username && (
                <span className="chat-rainbow text-xs font-semibold">{username}</span>
              )}
            </div>

            {!username ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
                <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                  Pick a username or get a random one.
                </p>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) =>
                    setUsernameInput(e.target.value.replace(/\s/g, "").slice(0, 24))
                  }
                  placeholder="your-username"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none
                             focus:border-primary-400 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-primary-600"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmUsername(usernameInput);
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => confirmUsername(usernameInput)}
                    className="rounded-lg bg-primary-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-600"
                  >
                    {usernameInput.trim() ? "Use name" : "Random name"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-3">
                  {messages.length === 0 && (
                    <p className="py-8 text-center text-xs text-neutral-400">
                      No messages yet. Say hello!
                    </p>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className="mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="chat-rainbow text-xs font-semibold">
                          {m.username}
                        </span>
                        <time className="text-[10px] text-neutral-400">
                          {new Date(m.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      </div>
                      <p className="mt-0.5 text-sm text-neutral-700 dark:text-neutral-300">
                        {m.message}
                      </p>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2 border-t border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value.slice(0, 500))}
                    placeholder="Type a message…"
                    className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none
                               focus:border-primary-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-primary-600"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label="Send message"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white
                               transition-colors hover:bg-primary-600 disabled:opacity-40"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
