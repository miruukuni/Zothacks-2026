"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getLocalProjectsSnapshot, parseLocalProjects, subscribeToLocalProjects } from "@/lib/local-projects";

const serverSnapshot = () => undefined;

export function useLocalProjects() {
  const raw = useSyncExternalStore(subscribeToLocalProjects, getLocalProjectsSnapshot, serverSnapshot);
  return useMemo(() => {
    try { return { projects: parseLocalProjects(raw), ready: raw !== undefined, error: "" }; }
    catch { return { projects: [], ready: raw !== undefined, error: "Saved browser projects could not be loaded. The demo projects are still available." }; }
  }, [raw]);
}
