import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { fetchStatus, type StatusItem } from "../lib/supabase";

export default function CurrentlyWorkingOn() {
  const [items, setItems] = useState<StatusItem[]>([]);

  useEffect(() => {
    fetchStatus().then((data) => setItems(data));

    const handleRefresh = () => {
      fetchStatus().then((data) => setItems(data));
    };

    window.addEventListener("status-updated", handleRefresh);
    return () => window.removeEventListener("status-updated", handleRefresh);
  }, []);

  if (items.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="container-page py-16"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/15 text-accent-600 dark:text-accent-400">
          <Zap size={18} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Currently Working On
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Live status</p>
        </div>
      </div>

      <div className="electric-border rounded-2xl border border-primary-200/80 bg-gradient-to-br from-primary-50/80
                     to-primary-100/30 p-6 dark:border-primary-800/60 dark:from-primary-950/40 dark:to-primary-900/20">
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-primary-500" />
              <span className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
