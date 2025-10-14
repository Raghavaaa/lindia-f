type TabKey = "property" | "research" | "case" | "junior";

interface TopTabsProps {
  active?: TabKey;
  onChange?: (next: TabKey) => void;
}

const tabs: { key: TabKey; label: string }[] = [
  { key: "property", label: "Property Opinions" },
  { key: "research", label: "Research" },
  { key: "case", label: "Case" },
  { key: "junior", label: "Junior" },
];

export default function TopTabs({ active = "property", onChange }: TopTabsProps) {
  return (
    <div className="w-full flex justify-end">
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-black/5 dark:border-white/10">
        {tabs.map(({ key, label }) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange?.(key)}
              className={
                `px-4 py-2 rounded-full text-sm font-medium transition-colors ` +
                (isActive
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700")
              }
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}


