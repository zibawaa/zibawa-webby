import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg
                 text-neutral-600 transition-colors hover:bg-neutral-100
                 dark:text-neutral-400 dark:hover:bg-neutral-800"
    >
      <motion.span
        key={dark ? "moon" : "sun"}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        {dark ? <Moon size={18} /> : <Sun size={18} />}
      </motion.span>
    </button>
  );
}
