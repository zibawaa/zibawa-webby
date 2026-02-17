import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export interface Message {
  id: string;
  created_at: string;
  username: string;
  message: string;
}

/**
 * Fetch the latest messages (most recent 50).
 */
export async function fetchMessages(): Promise<Message[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("fetchMessages error:", error);
    return [];
  }
  return (data as Message[]).reverse();
}

/**
 * Send a message to the global chat.
 */
export async function sendMessage(
  username: string,
  message: string,
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from("messages")
    .insert({ username, message: message.trim().slice(0, 500) });

  if (error) {
    console.error("sendMessage error:", error);
    return false;
  }
  return true;
}

/**
 * Subscribe to new message inserts via Supabase Realtime.
 */
export function subscribeMessages(
  onInsert: (msg: Message) => void,
): (() => void) | null {
  if (!supabase) return null;

  const channel = supabase
    .channel("public:messages")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      (payload) => {
        onInsert(payload.new as Message);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
