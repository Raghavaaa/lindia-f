"use client";
import Link from "next/link";
import { useState } from "react";
import { useAppStore } from "@/lib/store";

export default function Sidebar() {
  const { clients, directories, subdirectories, active, setActive, addDirectory, addSubdirectory } = useAppStore();
  const [showAddDirectory, setShowAddDirectory] = useState(false);
  const [showAddSubdirectory, setShowAddSubdirectory] = useState(false);
  const [newDirectoryName, setNewDirectoryName] = useState("");
  const [newSubdirectoryName, setNewSubdirectoryName] = useState("");

  const selectedClient = clients.find(c => c.id === active.clientId);
  const clientDirectories = directories.filter(d => d.clientId === active.clientId);
  const selectedDirectory = directories.find(d => d.id === active.directoryId);
  const directorySubdirectories = subdirectories.filter(s => s.directoryId === active.directoryId);

  const handleAddDirectory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDirectoryName.trim() && active.clientId) {
      addDirectory(active.clientId, newDirectoryName.trim());
      setNewDirectoryName("");
      setShowAddDirectory(false);
    }
  };

  const handleAddSubdirectory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubdirectoryName.trim() && active.directoryId) {
      addSubdirectory(active.directoryId, newSubdirectoryName.trim());
      setNewSubdirectoryName("");
      setShowAddSubdirectory(false);
    }
  };
  return (
    <aside className="w-64 shrink-0">
      <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-4 space-y-4">
        {/* Clients Section */}
        <div>
          <h2 className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-2 mb-2">Clients</h2>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {clients.length === 0 ? (
              <div className="px-3 py-2 text-sm text-zinc-500">No clients yet</div>
            ) : (
              clients.map((c) => {
                const isActive = active.clientId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActive({ clientId: c.id, directoryId: undefined, subdirectoryId: undefined })}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${isActive ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}
                  >
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-zinc-500">{c.phone}</div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Directories Section */}
        {selectedClient && (
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <h2 className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Directories</h2>
              <button
                onClick={() => setShowAddDirectory(!showAddDirectory)}
                className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                + Add
              </button>
            </div>
            
            {showAddDirectory && (
              <form onSubmit={handleAddDirectory} className="mb-2">
                <input
                  type="text"
                  value={newDirectoryName}
                  onChange={(e) => setNewDirectoryName(e.target.value)}
                  placeholder="Directory name"
                  className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-sm"
                  autoFocus
                />
              </form>
            )}
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {clientDirectories.map((d) => {
                const isActive = active.directoryId === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setActive({ directoryId: d.id, subdirectoryId: undefined })}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${isActive ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}
                  >
                    {d.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Subdirectories Section */}
        {selectedDirectory && (
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <h2 className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Subdirectories</h2>
              <button
                onClick={() => setShowAddSubdirectory(!showAddSubdirectory)}
                className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                + Add
              </button>
            </div>
            
            {showAddSubdirectory && (
              <form onSubmit={handleAddSubdirectory} className="mb-2">
                <input
                  type="text"
                  value={newSubdirectoryName}
                  onChange={(e) => setNewSubdirectoryName(e.target.value)}
                  placeholder="Subdirectory name"
                  className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-sm"
                  autoFocus
                />
              </form>
            )}
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {directorySubdirectories.map((s) => {
                const isActive = active.subdirectoryId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive({ subdirectoryId: s.id })}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${isActive ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-black/5 dark:border-white/10">
          <Link href="/settings" className="block px-3 py-2 rounded-xl text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">Settings</Link>
        </div>
      </div>
    </aside>
  );
}


