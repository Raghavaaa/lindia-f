"use client";
import Link from "next/link";
import { useAppStore } from "@/lib/store";

export default function Sidebar() {
  const { clients, active, setActive } = useAppStore();
  return (
    <aside className="w-64 shrink-0">
      <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-4 space-y-2">
        <h2 className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-2">Clients</h2>
        <div className="mt-1 flex flex-col">
          {clients.length === 0 ? (
            <div className="px-3 py-2 text-sm text-zinc-500">No clients yet. Add above.</div>
          ) : (
            clients.map((c) => {
              const isActive = active.clientId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActive({ clientId: c.id })}
                  className={`text-left px-3 py-2 rounded-xl text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${isActive ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}
                >
                  {c.name}
                </button>
              );
            })
          )}
        </div>
        <div className="pt-2 border-t border-black/5 dark:border-white/10">
          <Link href="/settings" className="block px-3 py-2 rounded-xl text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">Settings</Link>
        </div>
      </div>
    </aside>
  );
}


