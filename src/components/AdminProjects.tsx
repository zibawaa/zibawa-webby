import { useCallback, useEffect, useState } from "react";
import { Image as ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import {
  createProject,
  deleteProject,
  fetchProjects,
  supabase,
  updateProject,
  uploadProjectImage,
} from "../lib/supabase";
import type { DbProject } from "../lib/supabase";
import projectsFallback from "../content/projects.json";

interface JsonProject {
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

function toDbProject(p: JsonProject): DbProject {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const imageUrl = p.image?.startsWith("/")
    ? `${base}${p.image}`
    : p.image ?? null;
  return {
    id: p.id,
    created_at: new Date().toISOString(),
    title: p.title,
    description: p.description,
    tags: p.tags,
    status: p.status,
    github_url: p.githubUrl ?? null,
    live_url: p.liveUrl ?? null,
    image: imageUrl,
    featured: p.featured ?? false,
  };
}

const statusOptions = ["completed", "in-progress", "planned"] as const;

const emptyProject = {
  title: "",
  description: "",
  tags: "",
  status: "in-progress" as "completed" | "in-progress" | "planned",
  githubUrl: "",
  liveUrl: "",
  image: "" as string | undefined,
  featured: false,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [editing, setEditing] = useState<DbProject | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!supabase) return;
    setLoadError(null);
    fetchProjects().then(({ data, error }) => {
      setProjects(data);
      if (error) setLoadError(error.message);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const displayProjects =
    projects.length > 0
      ? projects
      : (projectsFallback as JsonProject[]).map(toDbProject);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;

    setSaving(true);

    let imageUrl: string | undefined = editing?.image ?? undefined;
    if (imageFile) {
      setUploading(true);
      imageUrl = (await uploadProjectImage(imageFile)) ?? undefined;
      setUploading(false);
    }

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const inSupabase = editing && projects.some((x) => x.id === editing.id);

    if (editing && inSupabase) {
      const ok = await updateProject(editing.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        tags,
        status: form.status,
        github_url: form.githubUrl.trim() || undefined,
        live_url: form.liveUrl.trim() || undefined,
        image: imageUrl,
        featured: form.featured,
      });
      if (ok) {
        setEditing(null);
        setForm(emptyProject);
        setImageFile(null);
        load();
        window.dispatchEvent(new Event("projects-updated"));
      }
    } else if (editing && !inSupabase) {
      // Editing a JSON project — import all with form edits applied
      await handleImport();
    } else {
      const created = await createProject({
        title: form.title.trim(),
        description: form.description.trim(),
        tags,
        status: form.status,
        github_url: form.githubUrl.trim() || undefined,
        live_url: form.liveUrl.trim() || undefined,
        image: imageUrl,
        featured: form.featured,
      });
      if (created) {
        setEditing(null);
        setForm(emptyProject);
        setImageFile(null);
        load();
        window.dispatchEvent(new Event("projects-updated"));
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const ok = await deleteProject(id);
    if (ok) {
      load();
      if (editing?.id === id) {
        setEditing(null);
        setForm(emptyProject);
      }
      window.dispatchEvent(new Event("projects-updated"));
    }
  };

  const startEdit = (p: DbProject) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      tags: p.tags.join(", "),
      status: p.status,
      githubUrl: p.github_url ?? "",
      liveUrl: p.live_url ?? "",
      image: p.image ?? "",
      featured: p.featured,
    });
    setImageFile(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyProject);
    setImageFile(null);
  };

  const handleImport = async () => {
    if (!supabase) return;
    setImporting(true);
    const json = projectsFallback as JsonProject[];
    for (const p of json) {
      // Use form data if user is currently editing this JSON project
      const isEditingThis = editing && editing.id === p.id;
      const title = isEditingThis ? form.title.trim() : p.title;
      const description = isEditingThis ? form.description.trim() : p.description;
      const tags = isEditingThis
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : p.tags;
      const status = isEditingThis ? form.status : p.status;
      const githubUrl = isEditingThis ? form.githubUrl.trim() || undefined : p.githubUrl;
      const liveUrl = isEditingThis ? form.liveUrl.trim() || undefined : p.liveUrl;
      const featured = isEditingThis ? form.featured : (p.featured ?? false);

      let imageUrl: string | undefined = p.image?.startsWith("/")
        ? `${window.location.origin}${p.image}`
        : p.image ?? undefined;
      if (isEditingThis && (editing?.image || imageFile)) {
        if (imageFile) {
          imageUrl = (await uploadProjectImage(imageFile)) ?? imageUrl;
        } else if (editing?.image) {
          imageUrl = editing.image;
        }
      }

      const created = await createProject({
        title,
        description,
        tags,
        status,
        github_url: githubUrl,
        live_url: liveUrl,
        image: imageUrl,
        featured,
      });
      if (!created) {
        setLoadError("Projects table not found. Run supabase/projects-table.sql in Supabase SQL Editor.");
        break;
      }
    }
    setEditing(null);
    setForm(emptyProject);
    setImageFile(null);
    setImporting(false);
    load();
    window.dispatchEvent(new Event("projects-updated"));
  };

  if (!supabase) return null;

  return (
    <div className="space-y-6">
      {loadError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          <strong>Projects table not found.</strong> Run{" "}
          <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">
            supabase/projects-table.sql
          </code>{" "}
          in your Supabase Dashboard → SQL Editor, then refresh.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h4 className="text-sm font-bold text-primary-700 dark:text-primary-400">
          {editing ? "Edit project" : "Add project"}
        </h4>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Project name"
            required
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none
                       focus:border-primary-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-primary-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Description *
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Short description"
            rows={3}
            required
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none
                       focus:border-primary-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-primary-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            placeholder="React, TypeScript, etc."
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none
                       focus:border-primary-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-primary-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({ ...f, status: e.target.value as typeof form.status }))
            }
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none
                       focus:border-primary-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-primary-600"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
              GitHub URL
            </label>
            <input
              type="url"
              value={form.githubUrl}
              onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
              placeholder="https://github.com/..."
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none
                         focus:border-primary-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-primary-600"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Live URL
            </label>
            <input
              type="url"
              value={form.liveUrl}
              onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none
                         focus:border-primary-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-primary-600"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Image
          </label>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-neutral-300 px-3 py-2 text-xs
                           text-neutral-500 hover:border-primary-400 hover:text-primary-600 dark:border-neutral-600 dark:text-neutral-400 dark:hover:border-primary-500">
              <Upload size={14} />
              {imageFile ? imageFile.name : "Choose image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {(form.image || editing?.image) && !imageFile && (
              <span className="text-xs text-neutral-400">Current image set</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="rounded border-neutral-300"
            />
            Featured on homepage
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-1 rounded-lg bg-primary-500 px-4 py-1.5
                       text-xs font-medium text-white hover:bg-primary-600 disabled:opacity-50"
          >
            {(saving || uploading) && (
              <Loader2 size={12} className="animate-spin" />
            )}
            {uploading ? "Uploading…" : saving ? "Saving…" : editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-neutral-500
                         hover:text-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-primary-700 dark:text-primary-400">
            {displayProjects.length} project{displayProjects.length !== 1 ? "s" : ""}
            {projects.length === 0 && " (from JSON — import to save to Supabase)"}
          </h4>
          {projects.length === 0 && (
            <button
              type="button"
              onClick={handleImport}
              disabled={importing}
              className="rounded-lg bg-primary-500 px-3 py-1 text-xs font-medium text-white hover:bg-primary-600 disabled:opacity-50"
            >
              {importing ? "Importing…" : "Import all to Supabase"}
            </button>
          )}
        </div>
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {displayProjects.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-neutral-200
                         bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="flex min-w-0 items-center gap-2">
                {p.image ? (
                  <img
                    src={p.image}
                    alt=""
                    className="h-8 w-8 shrink-0 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-neutral-100 dark:bg-neutral-800">
                    <ImageIcon size={12} className="text-neutral-400" />
                  </div>
                )}
                <span className="truncate text-sm font-medium">{p.title}</span>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => startEdit(p)}
                  className="rounded px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950"
                >
                  Edit
                </button>
                {projects.some((x) => x.id === p.id) && (
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
