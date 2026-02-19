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

  const load = useCallback(() => {
    fetchProjects().then(setProjects);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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

    if (editing) {
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

  if (!supabase) return null;

  return (
    <div className="space-y-6">
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
        <h4 className="mb-3 text-sm font-bold text-primary-700 dark:text-primary-400">
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </h4>
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {projects.map((p) => (
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
                <button
                  onClick={() => handleDelete(p.id)}
                  className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
