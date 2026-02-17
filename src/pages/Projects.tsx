import { motion } from "framer-motion";
import ProjectsGrid from "../components/ProjectsGrid";
import type { Project } from "../components/ProjectCard";
import projectsData from "../content/projects.json";

const projects = projectsData as Project[];

export default function Projects() {
  return (
    <section className="container-page py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Projects
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Things I&apos;ve built, am building, or plan to build.
        </p>
      </motion.div>

      <div className="mt-8">
        <ProjectsGrid projects={projects} showFilters />
      </div>
    </section>
  );
}
