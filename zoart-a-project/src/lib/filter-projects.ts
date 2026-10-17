import type { Project } from "@/types/project";

/** Text, all selected tags, and the selected category must match together. */
export function filterProjects(
  projects: Project[],
  query: string,
  selectedTags: string[],
  selectedCategory = "",
): Project[] {
  const search = query.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesSearch = [project.title, project.description, project.author, ...project.tags]
      .some((value) => value.toLowerCase().includes(search));
    const matchesTags = selectedTags.every((tag) => project.tags.includes(tag));
    const matchesCategory = !selectedCategory || project.category === selectedCategory;
    return matchesSearch && matchesTags && matchesCategory;
  });
}
