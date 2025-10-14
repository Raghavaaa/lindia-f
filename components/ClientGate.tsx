"use client";
import { useAppStore } from "@/lib/store";
import { useEffect, useMemo, useState } from "react";

interface ClientGateProps {
  onClose?: () => void;
}

export default function ClientGate({ onClose }: ClientGateProps) {
  const { clients, addClient, setActive } = useAppStore();
  const [query, setQuery] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRef, setNewRef] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => c.name.toLowerCase().includes(q));
  }, [clients, query]);

  function handleSelect(clientId: string) {
    setActive({ clientId });
    onClose?.();
  }

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    const created = addClient({
      name,
      phone: "",
      referenceId: newRef.trim() || undefined,
    });
    setActive({ clientId: created.id });
    onClose?.();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6">
        <h3 className="text-lg font-semibold mb-2">Select client or add new</h3>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clients..."
          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
        />
        <div className="mt-3 max-h-48 overflow-auto space-y-1">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {c.name}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-sm text-zinc-500 px-3 py-2">No matches</div>
          )}
        </div>
        {!showNew ? (
          <div className="mt-4 flex justify-end">
            <button onClick={() => setShowNew(true)} className="px-3 py-2 rounded-xl text-sm font-medium bg-black text-white">
              Add New Client
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm mb-1">Client name</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm mb-1">Reference ID (optional)</label>
              <input value={newRef} onChange={(e) => setNewRef(e.target.value)} className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 px-3 py-2 text-sm" />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={onClose} className="px-3 py-2 rounded-xl text-sm font-medium bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10">Cancel</button>
              <button onClick={handleCreate} className="px-3 py-2 rounded-xl text-sm font-medium bg-black text-white">Create</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


