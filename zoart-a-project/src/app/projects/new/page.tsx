import { Navbar } from "@/components/Navbar";
import { ProjectForm } from "@/components/ProjectForm";
import { getProjects } from "@/lib/projects";

export default async function NewProject() {
  const projects = await getProjects();
  const categories = Array.from(new Set(projects.flatMap((project) => project.category ? [project.category] : []))).sort();
  const tags = Array.from(new Set(projects.flatMap((project) => project.tags))).sort();

  return (
    <>
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-16">
        <p className="mb-3 text-sm font-semibold text-blue-700">MAKE ROOM FOR YOUR IDEA</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Post a project.</h1>
        <p className="mt-4 max-w-xl leading-7 text-slate-600">Tell the community what you’re building and who you’d love to build it with.</p>
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Browser-only preview: projects are saved on this browser and device. They won’t be shared with other users. Clearing browser data removes them.
        </p>
        <ProjectForm categories={categories} availableTags={tags} />
      </main>
    </>
  );
}
