"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { saveLocalProject } from "@/lib/local-projects";
import { validateProjectForm, type ProjectFormErrors, type ProjectFormValues } from "@/lib/project-validation";

const initialValues: ProjectFormValues = {
  title: "", author: "", description: "", category: "", contactInfo: "", tags: "",
  membersCurrent: "", membersWanted: "", githubUrl: "", websiteUrl: "",
};
const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-900 placeholder:text-slate-400";

export function ProjectForm({ categories, availableTags }: { categories: string[]; availableTags: string[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const savingRef = useRef(false);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ProjectFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedId, setSavedId] = useState("");

  useEffect(() => {
    if (!savedId) return;
    const timer = window.setTimeout(() => router.push(`/projects/${savedId}`), 1000);
    return () => window.clearTimeout(timer);
  }, [savedId, router]);

  function update(field: keyof ProjectFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function fieldProps(field: keyof ProjectFormValues) {
    return {
      id: field, name: field, value: values[field],
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => update(field, event.target.value),
      "aria-invalid": Boolean(errors[field]),
      "aria-describedby": errors[field] ? `${field}-error` : undefined,
      className: `${inputClass} ${errors[field] ? "border-red-500" : ""}`,
    };
  }

  function error(field: keyof ProjectFormValues) {
    return errors[field] ? <p id={`${field}-error`} className="mt-2 text-sm font-normal text-red-700">{errors[field]}</p> : null;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingRef.current) return;
    const result = validateProjectForm(values, categories);
    setErrors(result.errors);
    setSaveError("");
    if (!result.project) {
      const firstField = Object.keys(result.errors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
      return;
    }
    savingRef.current = true;
    setSaving(true);
    try {
      // Let the saving state render before the synchronous browser-storage write.
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const project = saveLocalProject(result.project);
      setSavedId(project.id);
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : "Could not save your project. Please try again.");
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10" aria-busy={saving && !savedId}>
      <p className="mb-6 text-sm text-slate-500">Fields marked <span className="text-red-700">*</span> are required.</p>
      {Object.values(errors).some(Boolean) && <p role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-800">Please fix the highlighted fields before submitting.</p>}
      <fieldset disabled={saving} className="space-y-6 disabled:opacity-70">
        <legend className="sr-only">Project information</legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <div><label htmlFor="title" className="text-sm font-medium text-slate-700">Project title <span className="text-red-700">*</span></label><input {...fieldProps("title")} required maxLength={120} placeholder="e.g. ZotSpots" />{error("title")}</div>
          <div><label htmlFor="author" className="text-sm font-medium text-slate-700">Author name <span className="text-red-700">*</span></label><input {...fieldProps("author")} required maxLength={100} autoComplete="name" placeholder="e.g. Maya Chen" />{error("author")}</div>
        </div>
        <div><label htmlFor="description" className="text-sm font-medium text-slate-700">Project description <span className="text-red-700">*</span></label><textarea {...fieldProps("description")} required rows={5} maxLength={10000} placeholder="What are you building? Who would you like to collaborate with?" />{error("description")}</div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div><label htmlFor="category" className="text-sm font-medium text-slate-700">Category <span className="text-red-700">*</span></label><select {...fieldProps("category")} required><option value="">Choose a category</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select>{error("category")}</div>
          <div><label htmlFor="contactInfo" className="text-sm font-medium text-slate-700">Contact email <span className="text-red-700">*</span></label><input {...fieldProps("contactInfo")} type="email" required autoComplete="email" maxLength={254} placeholder="maya@example.com" />{error("contactInfo")}</div>
        </div>
        <div>
          <label htmlFor="tags" className="text-sm font-medium text-slate-700">Technology stack / tags <span className="font-normal text-slate-500">(optional)</span></label>
          <input {...fieldProps("tags")} maxLength={500} placeholder="e.g. React, Design, Web Dev" aria-describedby="tags-help" />
          <p id="tags-help" className="mt-2 text-xs text-slate-500">Separate tags with commas, or add suggestions below.</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Suggested tags">
            {availableTags.map((tag) => {
              const selected = values.tags.split(",").some((value) => value.trim().toLowerCase() === tag.toLowerCase());
              return <button key={tag} type="button" aria-pressed={selected} className={`min-h-10 rounded-full border px-3 text-xs font-medium ${selected ? "border-blue-700 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600 hover:border-blue-400"}`} onClick={() => update("tags", selected ? values.tags.split(",").filter((value) => value.trim().toLowerCase() !== tag.toLowerCase()).join(",") : [values.tags.trim().replace(/,+$/, ""), tag].filter(Boolean).join(", "))}>{tag}</button>;
            })}
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div><label htmlFor="membersCurrent" className="text-sm font-medium text-slate-700">Current team size <span className="font-normal text-slate-500">(optional)</span></label><input {...fieldProps("membersCurrent")} type="number" min={0} step={1} placeholder="1" />{error("membersCurrent")}<p className="mt-2 text-xs text-slate-500">Include yourself. Defaults to 1 if left blank.</p></div>
          <div><label htmlFor="membersWanted" className="text-sm font-medium text-slate-700">Desired team size <span className="font-normal text-slate-500">(optional)</span></label><input {...fieldProps("membersWanted")} type="number" min={1} step={1} placeholder="e.g. 4" />{error("membersWanted")}<p className="mt-2 text-xs text-slate-500">Total desired size. Defaults to your current size (at least 1).</p></div>
        </div>
        <div><label htmlFor="githubUrl" className="text-sm font-medium text-slate-700">GitHub repository URL <span className="font-normal text-slate-500">(optional)</span></label><input {...fieldProps("githubUrl")} type="url" placeholder="https://github.com/you/project" />{error("githubUrl")}</div>
        <div><label htmlFor="websiteUrl" className="text-sm font-medium text-slate-700">Project website URL <span className="font-normal text-slate-500">(optional)</span></label><input {...fieldProps("websiteUrl")} type="url" placeholder="https://your-project.example.com" />{error("websiteUrl")}</div>
      </fieldset>
      {saveError && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-800">{saveError}</p>}
      {savedId && <div role="status" className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">Project saved in this browser! Opening your project… <Link className="font-semibold underline" href={`/projects/${savedId}`}>View project</Link></div>}
      <div className="mt-8 flex flex-wrap items-center justify-end gap-4 border-t border-slate-100 pt-6">
        {!saving && <Link href="/" className="inline-flex min-h-12 items-center rounded-xl border border-slate-300 px-5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</Link>}
        <button type="submit" disabled={saving} className="min-h-12 rounded-xl bg-blue-700 px-6 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-wait disabled:opacity-70">{savedId ? "Project saved" : saving ? "Saving project…" : "Submit Project"}</button>
      </div>
    </form>
  );
}
