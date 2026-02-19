import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Code2 } from "lucide-react";
import ProfileHeader from "../components/ProfileHeader";
import ProjectsGrid from "../components/ProjectsGrid";
import CurrentlyWorkingOn from "../components/CurrentlyWorkingOn";
import AdminPanel from "../components/AdminPanel";
import { useProjects } from "../hooks/useProjects";

export default function Home() {
  const { projects } = useProjects();
  const featured = projects.filter((p) => p.featured);

  return (
    <>
      <ProfileHeader />

      <CurrentlyWorkingOn />
      <AdminPanel />

      {/* Projects — distinct section with accent bar */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
        className="border-t border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/50"
      >
        <div className="container-page py-16 pb-24">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400">
                <Code2 size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Featured Projects
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Builds that ship
                </p>
              </div>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-300 px-4 py-2
                         text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50
                         dark:border-primary-700 dark:text-primary-400 dark:hover:bg-primary-950/50"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <ProjectsGrid projects={featured} />
        </div>
      </motion.section>
    </>
  );
}
