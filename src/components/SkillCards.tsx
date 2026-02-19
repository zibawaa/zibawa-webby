import { motion } from "framer-motion";
import { Code2, Palette, Server, Database } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Skill {
  icon: LucideIcon;
  title: string;
  items: string[];
}

const skills: Skill[] = [
  {
    icon: Code2,
    title: "Frontend",
    items: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
  },
  {
    icon: Server,
    title: "Backend",
    items: ["Node.js", "Express", "REST APIs", "GraphQL", "Python", "C++", "Bash Scripting"],
  },
  {
    icon: Database,
    title: "Data",
    items: ["PostgreSQL", "Supabase", "Redis", "Prisma"],
  },
  {
    icon: Palette,
    title: "Design",
    items: ["Figma", "UI/UX", "Responsive Design", "Accessibility"],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function SkillCards() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {skills.map((s) => (
        <motion.div
          key={s.title}
          variants={item}
          className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm
                     dark:border-neutral-800 dark:bg-neutral-900"
        >
          <s.icon size={22} className="mb-3 text-primary-500" />
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {s.title}
          </h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {s.items.map((tag) => (
              <li
                key={tag}
                className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600
                           dark:bg-neutral-800 dark:text-neutral-400"
              >
                {tag}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}
