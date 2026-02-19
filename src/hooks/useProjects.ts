import { useEffect, useState } from "react";
import { fetchProjects, supabase } from "../lib/supabase";
import type { Project } from "../components/ProjectCard";
import projectsFallback from "../content/projects.json";

function dbToProject(p: {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "completed" | "in-progress" | "planned";
  github_url: string | null;
  live_url: string | null;
  image: string | null;
  featured: boolean;
}): Project {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    tags: p.tags,
    status: p.status,
    githubUrl: p.github_url ?? undefined,
    liveUrl: p.live_url ?? undefined,
    image: p.image ?? undefined,
    featured: p.featured,
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(
    projectsFallback as Project[],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    fetchProjects()
      .then(({ data }) => {
        if (data.length > 0) {
          setProjects(data.map(dbToProject));
        }
      })
      .finally(() => setLoading(false));

    const handleRefresh = () => {
      fetchProjects().then(({ data }) => {
        if (data.length > 0) setProjects(data.map(dbToProject));
      });
    };

    window.addEventListener("projects-updated", handleRefresh);
    return () => window.removeEventListener("projects-updated", handleRefresh);
  }, []);

  return { projects, loading };
}
