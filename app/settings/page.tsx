"use client";
import { useAppStore } from "@/lib/store";
import { useId, useState, useEffect } from "react";
import Image from "next/image";

export default function SettingsPage() {
  const { logoDataUrl, setLogoDataUrl } = useAppStore();
  const inputId = useId();
  const [preview, setPreview] = useState<string | undefined>(logoDataUrl);
  const [prompt, setPrompt] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Load current prompt
    fetch("/api/research", { method: "GET" })
      .then(res => res.json())
      .then(data => setPrompt(data.prompt || ""))
      .catch(() => {});
  }, []);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setPreview(dataUrl);
      setLogoDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  async function handleSavePrompt() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/updatePrompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (res.ok) {
        setMessage("Prompt updated successfully!");
      } else {
        setMessage("Failed to update prompt");
      }
    } catch {
      setMessage("Error updating prompt");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <section className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6">
        <h2 className="text-sm uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">Upload Logo</h2>
        <p className="text-xs text-zinc-500 mb-3">Recommended 256×256 PNG</p>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl bg-black/10 dark:bg-white/10 overflow-hidden">
            {preview && (
              <Image src={preview} alt="Logo preview" width={64} height={64} className="h-full w-full object-cover" />
            )}
          </div>
          <div className="flex-1">
            <label htmlFor={inputId} className="block text-sm mb-1">Logo file</label>
            <input id={inputId} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleChange} className="block w-full text-sm" />
          </div>
        </div>
      </section>
      
      <section className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6">
        <h2 className="text-sm uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">Research Prompt</h2>
        <p className="text-xs text-zinc-500 mb-3">Customize how the AI responds to legal research queries</p>
        <div className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your custom prompt for legal research..."
            className="w-full min-h-32 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
          />
          <div className="flex items-center justify-between">
            <button
              onClick={handleSavePrompt}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-black text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Prompt"}
            </button>
            {message && <span className="text-sm text-green-600">{message}</span>}
          </div>
        </div>
      </section>
    </div>
  );
}


