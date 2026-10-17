import { notFound } from "next/navigation";
import { LocalProjectDetails } from "@/components/LocalProjectDetails";
import { ProjectDetailsContent } from "@/components/ProjectDetailsContent";
import { getProjectById, getProjects } from "@/lib/projects";

// Demo pages are pre-rendered; local-* IDs render a browser-storage lookup.
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ id: project.id }));
}

export default async function ProjectDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (project) return <ProjectDetailsContent project={project} />;
  if (id.startsWith("local-")) return <LocalProjectDetails id={id} />;
  notFound();
}
