"use client";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
}

interface Research {
  id: string;
  user_id: string;
  query_text: string;
  response_text: string;
  created_at: string;
}

interface Setting {
  key: string;
  value: string;
}

export default function DatabaseAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [research, setResearch] = useState<Research[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "research" | "settings">("users");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [usersRes, researchRes, settingsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/research"),
        fetch("/api/admin/settings")
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (researchRes.ok) setResearch(await researchRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="text-center">Loading database...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Database Admin</h1>
      
      {/* Tab Navigation */}
      <div className="flex gap-2 p-2 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-black/5 dark:border-white/10">
        {[
          { key: "users", label: `Users (${users.length})` },
          { key: "research", label: `Research (${research.length})` },
          { key: "settings", label: `Settings (${settings.length})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as "users" | "research" | "settings")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === key
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6">
          <h2 className="text-lg font-medium mb-4">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left py-2">ID</th>
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Phone</th>
                  <th className="text-left py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-2 font-mono text-xs">{user.id}</td>
                    <td className="py-2">{user.name}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">{user.phone || "-"}</td>
                    <td className="py-2 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Research Tab */}
      {activeTab === "research" && (
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6">
          <h2 className="text-lg font-medium mb-4">Research Queries</h2>
          <div className="space-y-4">
            {research.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-800">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-sm">{item.query_text}</div>
                  <div className="text-xs text-zinc-500">{new Date(item.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                  {item.response_text}
                </div>
                <div className="text-xs text-zinc-500 mt-2">User ID: {item.user_id}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6">
          <h2 className="text-lg font-medium mb-4">Settings</h2>
          <div className="space-y-3">
            {settings.map((setting) => (
              <div key={setting.key} className="flex justify-between items-center p-3 rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-800">
                <div className="font-medium">{setting.key}</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md truncate">
                  {setting.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
