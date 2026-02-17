import { motion } from "framer-motion";

export interface Update {
  id: string;
  date: string;
  title: string;
  body: string;
  projectId?: string;
}

interface Props {
  updates: Update[];
  limit?: number;
}

export default function ProcessTimeline({ updates, limit }: Props) {
  const items = limit ? updates.slice(0, limit) : updates;

  return (
    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-neutral-200 dark:bg-neutral-800 sm:left-[9px]" />

      {items.map((u, i) => (
        <motion.div
          key={u.id}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="relative pl-8 pb-8 sm:pl-10"
        >
          {/* Dot */}
          <div className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-primary-500 bg-white sm:h-[19px] sm:w-[19px] dark:bg-neutral-950" />

          <time className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
            {new Date(u.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
          <h3 className="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {u.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {u.body}
          </p>
          {u.projectId && (
            <span className="mt-2 inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500">
              {u.projectId}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
