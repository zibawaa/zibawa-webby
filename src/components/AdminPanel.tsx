import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, LogOut, Plus, Trash2, Save, Loader2, FolderOpen } from "lucide-react";
import { fetchStatus, saveStatus, supabase, type StatusItem } from "../lib/supabase";
import AdminProjects from "./AdminProjects";

const ADMIN_KEY = "zibawa-admin-auth";
const ADMIN_PASS = "zibawa2026";

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [items, setItems] = useState<StatusItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"status" | "projects">("status");

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_KEY);
    if (stored === "true") {
      setAuthed(true);
      fetchStatus().then((data) => setItems(data));
    }
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASS) {
      localStorage.setItem(ADMIN_KEY, "true");
      setAuthed(true);
      fetchStatus().then((data) => setItems(data));
      setShowLogin(false);
      setPassword("");
      setError("");
    } else {
      setError("Wrong password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY);
    setAuthed(false);
    setItems([]);
  };

  const handleSave = useCallback(async () => {
    const clean = items.filter((i) => i.text.trim() !== "");
    setSaving(true);
    const ok = await saveStatus(clean);
    setSaving(false);

    if (ok) {
      setItems(clean);
      window.dispatchEvent(new Event("status-updated"));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setError("Failed to save — check Supabase connection");
      setTimeout(() => setError(""), 3000);
    }
  }, [items]);

  const addItem = () => {
    setItems((prev) => [...prev, { text: "" }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, text: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { text } : item)));
  };

  // Don't show admin panel if Supabase isn't configured
  if (!supabase) return null;

  if (!authed) {
    return (
      <div className="container-page pb-8">
        {!showLogin ? (
          <button
            onClick={() => setShowLogin(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5
                       text-xs font-medium text-neutral-500 transition-colors hover:border-primary-300 hover:text-primary-600
                       dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-primary-600 dark:hover:text-primary-400"
          >
            <Lock size={12} /> Admin
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xs"
          >
            <div className="flex gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Password"
                autoFocus
                className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none
                           focus:border-primary-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-primary-600"
              />
              <button
                onClick={handleLogin}
                className="rounded-lg bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600"
              >
                Login
              </button>
              <button
                onClick={() => { setShowLogin(false); setPassword(""); setError(""); }}
                className="rounded-lg border border-neutral-200 px-2 py-1.5 text-sm text-neutral-500 hover:text-neutral-700
                           dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                Cancel
              </button>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="container-page pb-8"
    >
      <div className="rounded-xl border-2 border-dashed border-primary-300 bg-primary-50/30 p-5 dark:border-primary-800 dark:bg-primary-950/20">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("status")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === "status"
                  ? "bg-primary-500 text-white"
                  : "text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
              }`}
            >
              Status
            </button>
            <button
              onClick={() => setTab("projects")}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === "projects"
                  ? "bg-primary-500 text-white"
                  : "text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
              }`}
            >
              <FolderOpen size={12} /> Projects
            </button>
          </div>
          <h3 className="text-sm font-bold text-primary-700 dark:text-primary-400">
            {tab === "status" ? "Edit \"Currently Working On\"" : "Add / Edit Projects"}
          </h3>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs font-medium text-green-600 dark:text-green-400">Saved globally!</span>
            )}
            {error && (
              <span className="text-xs font-medium text-red-500">{error}</span>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-neutral-500 hover:text-red-500 dark:text-neutral-400"
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>

        {tab === "status" ? (
          <>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateItem(i, e.target.value)}
                    placeholder="What are you working on?"
                    className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none
                               focus:border-primary-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-primary-600"
                  />
                  <button
                    onClick={() => removeItem(i)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={addItem}
                className="inline-flex items-center gap-1 rounded-lg border border-dashed border-neutral-300 px-3 py-1.5
                           text-xs font-medium text-neutral-500 hover:border-primary-400 hover:text-primary-600
                           dark:border-neutral-600 dark:text-neutral-400 dark:hover:border-primary-500 dark:hover:text-primary-400"
              >
                <Plus size={12} /> Add item
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1 rounded-lg bg-primary-500 px-4 py-1.5
                           text-xs font-medium text-white hover:bg-primary-600 disabled:opacity-50"
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </>
        ) : (
          <AdminProjects />
        )}
      </div>
    </motion.div>
  );
}
