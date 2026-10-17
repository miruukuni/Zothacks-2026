import type { ProjectDraft } from "@/types/project";

export type ProjectFormValues = {
  title: string;
  author: string;
  description: string;
  category: string;
  contactInfo: string;
  tags: string;
  membersCurrent: string;
  membersWanted: string;
  githubUrl: string;
  websiteUrl: string;
};

export type ProjectFormErrors = Partial<Record<keyof ProjectFormValues, string>>;

function isWebUrl(value: string, githubOnly = false): boolean {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return false;
    return !githubOnly || (
      ["github.com", "www.github.com"].includes(url.hostname) &&
      url.pathname.split("/").filter(Boolean).length >= 2
    );
  } catch {
    return false;
  }
}

/** Validate and normalize form inputs before anything is written to storage. */
export function validateProjectForm(values: ProjectFormValues, categories: string[]): {
  errors: ProjectFormErrors;
  project?: ProjectDraft;
} {
  const errors: ProjectFormErrors = {};
  const title = values.title.trim();
  const author = values.author.trim();
  const description = values.description.trim();
  const category = values.category.trim();
  const contactInfo = values.contactInfo.trim();
  const githubUrl = values.githubUrl.trim();
  const websiteUrl = values.websiteUrl.trim();
  if (!title) errors.title = "Enter a project title.";
  if (!author) errors.author = "Enter your name.";
  if (!description) errors.description = "Describe your project.";
  if (!category || !categories.includes(category)) errors.category = "Choose a project category.";
  if (!contactInfo) errors.contactInfo = "Enter a contact email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo)) errors.contactInfo = "Enter a valid email, like maya@example.com.";
  if (githubUrl && !isWebUrl(githubUrl, true)) errors.githubUrl = "Enter a GitHub repository URL, like https://github.com/you/project.";
  if (websiteUrl && !isWebUrl(websiteUrl)) errors.websiteUrl = "Enter a complete http:// or https:// website URL.";

  const membersCurrent = values.membersCurrent.trim() === "" ? 1 : Number(values.membersCurrent);
  const membersWanted = values.membersWanted.trim() === "" ? Math.max(1, membersCurrent) : Number(values.membersWanted);
  if (!Number.isSafeInteger(membersCurrent) || membersCurrent < 0) errors.membersCurrent = "Enter a whole number of 0 or more.";
  if (!Number.isSafeInteger(membersWanted) || membersWanted < 1) errors.membersWanted = "Enter a whole number of at least 1.";
  else if (!errors.membersCurrent && membersWanted < membersCurrent) errors.membersWanted = "Desired team size cannot be smaller than the current team.";

  if (Object.keys(errors).length) return { errors };
  return {
    errors,
    project: {
      title, author, description, category, contactInfo,
      tags: Array.from(new Map(values.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => [tag.toLowerCase(), tag])).values()),
      membersCurrent, membersWanted,
      ...(githubUrl ? { githubUrl } : {}),
      ...(websiteUrl ? { websiteUrl } : {}),
    },
  };
}
