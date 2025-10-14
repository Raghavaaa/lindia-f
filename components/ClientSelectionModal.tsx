"use client";
import { useState } from "react";

interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

interface Props {
  onSelectClient: (client: Client) => void;
  onCreateClient: (client: Omit<Client, "id">) => void;
  onClose: () => void;
  existingClients: Client[];
}

export default function ClientSelectionModal({ onSelectClient, onCreateClient, onClose, existingClients }: Props) {
  const [mode, setMode] = useState<"select" | "create">("select");
  const [newClient, setNewClient] = useState({ name: "", phone: "", email: "", address: "" });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClient.name.trim() && newClient.phone.trim()) {
      onCreateClient({
        name: newClient.name.trim(),
        phone: newClient.phone.trim(),
        email: newClient.email.trim() || undefined,
        address: newClient.address.trim() || undefined,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-semibold mb-4">Client Selection</h3>
        
        {mode === "select" ? (
          <div className="space-y-3">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMode("select")}
                className="px-3 py-2 rounded-xl text-sm font-medium bg-black text-white"
              >
                Select Existing
              </button>
              <button
                onClick={() => setMode("create")}
                className="px-3 py-2 rounded-xl text-sm font-medium bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10"
              >
                Create New
              </button>
            </div>
            
            {existingClients.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {existingClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => onSelectClient(client)}
                    className="w-full text-left p-3 rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-zinc-500">{client.phone}</div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 text-center py-4">No existing clients found</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleCreateClient} className="space-y-4">
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setMode("select")}
                className="px-3 py-2 rounded-xl text-sm font-medium bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10"
              >
                Select Existing
              </button>
              <button
                type="button"
                onClick={() => setMode("create")}
                className="px-3 py-2 rounded-xl text-sm font-medium bg-black text-white"
              >
                Create New
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Client Name *</label>
              <input
                type="text"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-sm"
                placeholder="Enter client name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input
                type="tel"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-sm"
                placeholder="Enter phone number"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email (Optional)</label>
              <input
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-sm"
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Office Address (Optional)</label>
              <textarea
                value={newClient.address}
                onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-sm"
                placeholder="Enter office address"
                rows={2}
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-3 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-3 py-2 rounded-xl text-sm font-medium bg-black text-white"
              >
                Create Client
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
