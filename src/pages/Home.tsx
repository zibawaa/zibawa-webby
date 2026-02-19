import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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

      <section className="container-page pb-20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Projects
          </h2>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <ProjectsGrid projects={featured} />
      </section>
    </>
  );
}
