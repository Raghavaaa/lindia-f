"use client";
import React from "react";

export default function Sidebar({ clients, onSelect, onOpenNew, selected }: { clients: { id: string; name: string }[]; onSelect: (id: string) => void; onOpenNew: () => void; selected?: string }) {
  return (
    <aside className="hidden lg:block border-r border-gray-100 h-[calc(100vh-128px)] sticky top-16 p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium">Clients</div>
        <button onClick={onOpenNew} className="text-sm px-2 py-1 rounded-full border">+ New</button>
      </div>

      <div className="space-y-2">
        {clients.length === 0 && <div className="text-sm text-gray-400">No clients yet.</div>}
        {clients.map((c) => (
          <button key={c.id} onClick={() => onSelect(c.id)} className={`w-full text-left px-3 py-2 rounded-lg ${selected === c.id ? "bg-brand-50" : "hover:bg-gray-50"}`}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <a href="/settings" className="text-sm text-gray-600 hover:underline">Settings</a>
      </div>
    </aside>
  );
}
