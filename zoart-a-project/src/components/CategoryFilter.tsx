type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
};

/** One category at a time; an empty value includes every project. */
export function CategoryFilter({ categories, selectedCategory, onChange }: CategoryFilterProps) {
  return (
    <fieldset className="mt-6">
      <legend className="mb-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
        Browse by category
      </legend>
      <div className="flex flex-wrap gap-2">
        {["", ...categories].map((category) => {
          const selected = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={selected}
              aria-controls="project-results"
              onClick={() => onChange(selected ? "" : category)}
              className={`min-h-11 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                selected
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-700"
              }`}
            >
              {category || "All categories"}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
