import { motion } from "framer-motion";
import { ExternalLink, Github, Image as ImageIcon } from "lucide-react";
import Magnet from "./animations/Magnet";

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "completed" | "in-progress" | "planned";
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  featured?: boolean;
}

const statusColors: Record<Project["status"], string> = {
  completed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  "in-progress": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  planned: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

export default function ProjectCard({ project }: { project: Project }) {
  const href = project.liveUrl || project.githubUrl || "#";

  return (
    <Magnet padding={100} magnetStrength={8} wrapperClassName="block">
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35 }}
        className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200
                   bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1
                   dark:border-neutral-800 dark:bg-neutral-900"
      >
      {/* Image */}
      <div className="flex h-40 items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ImageIcon size={32} className="text-neutral-300 dark:text-neutral-600" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-neutral-900 group-hover:text-primary-600 dark:text-neutral-100 dark:group-hover:text-primary-400 transition-colors">
            {project.title}
          </h3>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700
                         dark:bg-primary-950 dark:text-primary-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Link label */}
        <div className="flex gap-3 pt-1">
          {project.githubUrl && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500
                       group-hover:text-primary-600 dark:text-neutral-400 dark:group-hover:text-primary-400 transition-colors">
              <Github size={14} /> Code
            </span>
          )}
          {project.liveUrl && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500
                       group-hover:text-primary-600 dark:text-neutral-400 dark:group-hover:text-primary-400 transition-colors">
              <ExternalLink size={14} /> Live
            </span>
          )}
        </div>
      </div>
    </motion.a>
    </Magnet>
  );
}
