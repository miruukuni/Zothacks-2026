"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ProjectDetailsContent } from "@/components/ProjectDetailsContent";
import { useLocalProjects } from "@/lib/use-local-projects";

export function LocalProjectDetails({ id }: { id: string }) {
  const { projects, ready, error } = useLocalProjects();
  const project = projects.find((project) => project.id === id);
  if (project) return <ProjectDetailsContent project={project} isLocal />;

  return (
    <>
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8">
        {!ready ? <p role="status" className="text-slate-600">Loading your saved project…</p> : (
          <>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Project not found in this browser.</h1>
            <p className="mt-4 leading-7 text-slate-600">{error || "Browser-saved projects are available only in the browser and device where they were created. The saved data may also have been cleared."}</p>
          </>
        )}
        <Link href="/#projects" className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-blue-700 underline">Back to Projects</Link>
      </main>
    </>
  );
}
