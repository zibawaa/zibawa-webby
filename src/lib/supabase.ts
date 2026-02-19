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

/* ========================================================== */
/*  STATUS  (Currently Working On — single row, id=1)         */
/* ========================================================== */

export interface StatusItem {
  text: string;
}

/**
 * Fetch the global "currently working on" items.
 */
export async function fetchStatus(): Promise<StatusItem[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("status")
    .select("items")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("fetchStatus error:", error);
    return [];
  }
  return (data?.items ?? []) as StatusItem[];
}

/**
 * Save the global "currently working on" items (upsert single row).
 */
export async function saveStatus(items: StatusItem[]): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from("status")
    .upsert({ id: 1, items, updated_at: new Date().toISOString() });

  if (error) {
    console.error("saveStatus error:", error);
    return false;
  }
  return true;
}

/* ========================================================== */
/*  PROJECTS  (admin-managed project cards)                   */
/* ========================================================== */

export interface DbProject {
  id: string;
  created_at: string;
  title: string;
  description: string;
  tags: string[];
  status: "completed" | "in-progress" | "planned";
  github_url: string | null;
  live_url: string | null;
  image: string | null;
  featured: boolean;
}

const BUCKET = "project-images";

/**
 * Fetch all projects from Supabase.
 * Returns { data, error }. Use error to show user-facing message (e.g. table missing).
 */
export async function fetchProjects(): Promise<{
  data: DbProject[];
  error: { message: string; code?: string } | null;
}> {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchProjects error:", error);
    return {
      data: [],
      error: { message: error.message, code: error.code },
    };
  }
  return { data: (data ?? []) as DbProject[], error: null };
}

/**
 * Create a new project.
 */
export async function createProject(project: {
  title: string;
  description: string;
  tags: string[];
  status: "completed" | "in-progress" | "planned";
  github_url?: string;
  live_url?: string;
  image?: string;
  featured?: boolean;
}): Promise<DbProject | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: project.title,
      description: project.description,
      tags: project.tags,
      status: project.status,
      github_url: project.github_url || null,
      live_url: project.live_url || null,
      image: project.image || null,
      featured: project.featured ?? false,
    })
    .select()
    .single();

  if (error) {
    console.error("createProject error:", error);
    return null;
  }
  return data as DbProject;
}

/**
 * Update an existing project.
 */
export async function updateProject(
  id: string,
  project: Partial<{
    title: string;
    description: string;
    tags: string[];
    status: "completed" | "in-progress" | "planned";
    github_url: string;
    live_url: string;
    image: string;
    featured: boolean;
  }>,
): Promise<boolean> {
  if (!supabase) return false;
  const clean = Object.fromEntries(
    Object.entries(project).filter(([, v]) => v !== undefined)
  ) as Record<string, unknown>;
  const { error } = await supabase.from("projects").update(clean).eq("id", id);

  if (error) {
    console.error("updateProject error:", error);
    return false;
  }
  return true;
}

/**
 * Delete a project.
 */
export async function deleteProject(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("deleteProject error:", error);
    return false;
  }
  return true;
}

/**
 * Upload a project image to Supabase Storage. Returns the public URL.
 */
export async function uploadProjectImage(file: File): Promise<string | null> {
  if (!supabase) return null;

  const ext = file.name.split(".").pop() || "png";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("uploadProjectImage error:", error);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
