import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const STORAGE_KEY = "zibawa-current-status";

interface StatusItem {
  text: string;
  updatedAt: string;
}

const defaultStatus: StatusItem[] = [
  { text: "Building out this portfolio site with live chat", updatedAt: new Date().toISOString() },
  { text: "Polishing Trackademic for public demo", updatedAt: new Date().toISOString() },
];

export function getCurrentStatus(): StatusItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as StatusItem[];
  } catch {
    /* ignore */
  }
  return defaultStatus;
}

export function setCurrentStatus(items: StatusItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function CurrentlyWorkingOn() {
  const [items, setItems] = useState<StatusItem[]>([]);

  useEffect(() => {
    setItems(getCurrentStatus());

    const handleStorage = () => setItems(getCurrentStatus());
    window.addEventListener("status-updated", handleStorage);
    return () => window.removeEventListener("status-updated", handleStorage);
  }, []);

  if (items.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="container-page pb-16"
    >
      <div className="mb-5 flex items-center gap-2">
        <Zap size={20} className="text-primary-500" />
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          Currently Working On
        </h2>
      </div>

      <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-5 dark:border-primary-900/50 dark:bg-primary-950/30">
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
