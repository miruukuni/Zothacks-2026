import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { TagBadge } from "@/components/TagBadge";
import type { Project } from "@/types/project";

/** Shared minimal details view for demo data and browser-saved submissions. */
export function ProjectDetailsContent({ project, isLocal = false }: { project: Project; isLocal?: boolean }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-16">
        <Link href="/#projects" className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-blue-700 underline-offset-4 hover:underline">
          <span aria-hidden="true">←</span> Back to Projects
        </Link>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
          <p className="mb-5 text-xs font-medium text-amber-900">{isLocal ? "Saved in this browser · Visible only on this device" : "Demo · Fictional project"}</p>
          <p className="mb-3 text-sm font-medium text-blue-700">{project.category || "Uncategorized"}</p>
          <h1 className="text-3xl font-semibold tracking-tight break-words text-slate-900 sm:text-5xl">{project.title}</h1>
          <p className="mt-4 text-sm text-slate-600">A project by <span className="font-medium text-slate-900">{project.author}</span></p>
          <section aria-labelledby="about-heading" className="mt-8 border-t border-slate-100 pt-8">
            <h2 id="about-heading" className="text-lg font-semibold text-slate-900">About the project</h2>
            <p className="mt-3 leading-8 whitespace-pre-wrap break-words text-slate-600">{project.description}</p>
          </section>
          {project.tags.length > 0 && (
            <section aria-labelledby="tags-heading" className="mt-8">
              <h2 id="tags-heading" className="text-lg font-semibold text-slate-900">Stack & interests</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => <li key={tag}><TagBadge tag={tag} /></li>)}
              </ul>
            </section>
          )}
        </article>
      </main>
    </>
  );
}
