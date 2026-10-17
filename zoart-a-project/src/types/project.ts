/** Shared browse/detail shape. membersWanted is the total desired team size. */
export type Project = {
  id: string;
  title: string;
  author: string;
  description: string;
  tags: string[];
  /** Optional so existing listings without a category remain compatible. */
  category?: string;
  membersCurrent: number;
  membersWanted: number;
  contactInfo: string;
  githubUrl?: string;
  websiteUrl?: string;
};

export type ProjectDraft = Omit<Project, "id">;
