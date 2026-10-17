# Zot a Project — home/search frontend

A UCI student project-discovery board built with Next.js App Router, React,
TypeScript, and Tailwind CSS v4. Browse nine **fictional demo projects** and submit
your own ideas to temporary browser storage.

## Run locally

From this directory (`zoart-a-project`):

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm run lint`, `npx tsc --noEmit`, and
`npm run build` to check the app. No environment variables are needed for the demo.

## Where things live

- `src/app/page.tsx`: server-rendered homepage, hero, and navigation.
- `src/app/projects/[id]/page.tsx`: minimal project details, reusing the same data
  source, Navbar, and TagBadge; includes a Back to Projects link.
- `src/app/projects/new/page.tsx`: submission page; derives categories and suggested
  tags from the existing demo data.
- `src/components/ProjectForm.tsx`: controlled inputs, inline errors, saving and
  success states, and navigation to the saved project.
- `src/components/ProjectDetailsContent.tsx` and `LocalProjectDetails.tsx`: shared
  minimal details layout and browser-only lookup for submitted projects.
- `src/components/ProjectBrowser.tsx`: client boundary for search/tag state.
- `src/components/`: reusable Navbar, SearchBar, CategoryFilter, TagFilter, TagBadge,
  ProjectCard, and ProjectGrid.
- `src/types/project.ts`: shared Project shape. `membersWanted` means total
  desired team size; a team at or above that number displays “Team full”.
  `category` is optional for compatibility with older listings; cards without it
  display “Uncategorized” and remain visible under All categories.
- `src/lib/projects.ts`: fictional listings and the asynchronous `getProjects()`
  data boundary. Replace its implementation when connecting the database.
- `src/lib/filter-projects.ts`: pure search/filter function, independent of React.
- `src/lib/project-validation.ts`: typed form validation and normalization.
- `src/lib/local-projects.ts`: browser-storage adapter, record checks, and change
  notifications. `src/lib/use-local-projects.ts` subscribes React to those changes.
- `src/app/globals.css`: theme, focus styles, and decorative hero artwork.

## How the data flows

The server page calls `getProjects()` and passes the demo results to ProjectBrowser
through **props** (component inputs). ProjectBrowser stores the search text and
selected tags/category in React **state**; typing or clicking a filter updates that state and
renders the matching cards immediately. SearchBar and TagFilter receive values
and callbacks as props so they do not need their own copies of the state.

`filterProjects()` uses `.filter()` to create a new array containing only matching
projects. Text search ignores case and outer whitespace and checks title,
description, author, and tags. A project must contain **every selected tag** as
well as match the search text and chosen category. Choose one category at a time;
click the active category again or choose All categories to remove that constraint.
Clear filters and Reset all filters reset search, tags, and category together.
Available tags and categories come from the full project data, so new values
automatically get filters and choices stay available even when no projects match.

Browser-saved projects are merged before the demos once browser storage is available.
`useSyncExternalStore` provides a server-safe initial render, loads the local records
after hydration, and subscribes to changes in this tab and other tabs on the same origin.
The nine demos are never written into localStorage or replaced by submissions.

## Phase 2 submission and temporary storage

Open `/projects/new` or click Post a project. Title, author, description, an existing
category, and a valid contact email are required. Tags accept comma-separated text
and selectable suggestions. Case-insensitive duplicates and empty tags are removed.
Links must use http/https; GitHub links must point to a github.com owner/repository path.

Current team size includes the creator, accepts whole numbers of at least zero,
and defaults to 1 when blank. Desired size must be a whole number of at least 1,
cannot be smaller than the current team, and defaults to the current size (at least 1).
The two optional links are saved as `githubUrl` and `websiteUrl` on `Project`.

On submission the form validates, prevents duplicate saves, writes a unique
`local-<UUID>` project, announces success, and opens its details after one second.
Invalid inputs and storage errors leave the form intact. Unreadable existing data
is not silently overwritten. Storage quota/permission failures show a retryable error.

Records live in localStorage under `zoart.projects.v1`. They persist on refresh
in the **same browser profile and origin** (scheme, host, and port). They do not
synchronize between users/devices, and clearing browser data removes them. This
is a prototype, not a shared publishing backend. Avoid entering sensitive data.

The server cannot read browser storage, so `local-*` detail URLs render a client
lookup with a loading state. Missing local records show “Project not found in this
browser” with a return link; their HTTP shell remains 200. Unknown nonlocal IDs
still return a server 404. Contact actions and expanded details remain for Phase 3.

## Teammate integration

- `/projects/[id]` now shows the title, author, full description, category, and tags
  for each demo project. `getProjectById()` in `src/lib/projects.ts` looks up the
  same IDs used by cards. All nine demo paths are pre-rendered. Submitted `local-*`
  IDs are read from browser storage, preserving the same minimal layout.
- `/projects/new` is functional with browser storage. Replace the creation/storage
  adapter and browser subscription when adding Supabase; do not duplicate the schema.
- Replace `getProjects()` with server-side Supabase access and map the real schema
  into `Project` in a dedicated adapter. No backend routes or database schema are
  assumed here. Keep service-role credentials on the server.
- Cards do not render contact information. Before exposing real data, return only
  public browse fields to the client; retrieve private contact details separately
  on the detail route with appropriate access checks. Demo contact fields are empty.
- Authentication, Supabase, contact actions, and the remaining Phase 3 detail
  features are outside Phase 2. No new dependencies or credentials are required.

## Manual checks

- Desktop: three columns; medium screens (768px+): two; mobile: one.
- Open each of the nine project cards and verify its details and Back to Projects
  link. For example, `/projects/zot-spots` shows ZotSpots and Maya Chen; a made-up
  ID such as `/projects/not-a-project` should still return a 404.
- Search `MAYA`, `coffee`, or `hardware`; verify title/description/author/tag matches.
- Select Web Dev and Sustainability: only Second Serving remains. Add Music:
  the empty state appears. Reset restores all nine projects.
- Search `pixel` while Design is selected: Tiny Tides remains.
- Select Sustainability, then Web Dev: only Second Serving remains. Search `food`:
  it still matches. Search `pixel`: an empty state appears. Reset all filters
  restores all nine projects and the All categories selection.
- Select Research & Learning: Open Lab and Course Compass remain. Click the active
  category again to restore all categories. Cards display category separately from tags.
- Open Lab shows “Team full”; other cards show available places and current/total.
- Use Tab, Enter, and Space to navigate, activate links, and toggle tag buttons.
  Focus is visible, tag selection is announced, and result counts are live.
- Open `/projects/new` and submit empty fields: five required-field errors appear.
  Try an invalid email, malformed URLs, a negative or fractional team count, and
  a desired size below the current size; verify helpful inline errors.
- Submit a valid project with a unique title, category, and tag. Confirm success
  and navigation to its details. Refresh that URL, then use Back to Projects:
  your card and all nine demos remain. Find it using text, category, and tag filters.
- Reload the homepage and verify the saved card is still there. Use the same host
  (`localhost`, not `127.0.0.1`) and port so localStorage belongs to the same origin.
- Test the form and details at 320px/390px and desktop widths, including Cancel.
