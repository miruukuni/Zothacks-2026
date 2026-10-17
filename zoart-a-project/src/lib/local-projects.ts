import type { Project, ProjectDraft } from "@/types/project";

export const LOCAL_PROJECTS_KEY = "zoart.projects.v1";
const CHANGE_EVENT = "zoart:projects-changed";

function isProject(value: unknown): value is Project {
  if (typeof value !== "object" || value === null) return false;
  const project = value as Record<string, unknown>;
  return typeof project.id === "string" && /^local-[a-zA-Z0-9-]+$/.test(project.id) &&
    [project.title, project.author, project.description, project.contactInfo].every((field) => typeof field === "string") &&
    Array.isArray(project.tags) && project.tags.every((tag) => typeof tag === "string") &&
    typeof project.membersCurrent === "number" && Number.isSafeInteger(project.membersCurrent) && project.membersCurrent >= 0 &&
    typeof project.membersWanted === "number" && Number.isSafeInteger(project.membersWanted) && project.membersWanted >= Math.max(1, project.membersCurrent) &&
    [project.category, project.githubUrl, project.websiteUrl].every((field) => field === undefined || typeof field === "string");
}

export function parseLocalProjects(raw: string | null | undefined): Project[] {
  if (raw == null) return [];
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value) || !value.every(isProject)) throw new Error("Invalid saved project data.");
  return value;
}

/** A stable string snapshot avoids hydration mismatches and unnecessary React updates. */
export function getLocalProjectsSnapshot(): string | null {
  try { return window.localStorage.getItem(LOCAL_PROJECTS_KEY); }
  catch { return null; }
}

export function subscribeToLocalProjects(onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === LOCAL_PROJECTS_KEY || event.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** Browser-only temporary persistence; swap this boundary for database creation later. */
export function saveLocalProject(draft: ProjectDraft): Project {
  let projects: Project[];
  try { projects = parseLocalProjects(window.localStorage.getItem(LOCAL_PROJECTS_KEY)); }
  catch { throw new Error("Saved projects could not be read. Check browser storage permissions or export and repair the saved data before trying again."); }
  const project: Project = { ...draft, id: `local-${crypto.randomUUID()}` };
  try { window.localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify([project, ...projects])); }
  catch { throw new Error("Your project could not be saved. Browser storage may be full or disabled. Your form has been kept so you can try again."); }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return project;
}
