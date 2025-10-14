"use client";
import { useAppStore } from "@/lib/store";
import { useId, useState } from "react";
import Image from "next/image";

export default function SettingsPage() {
  const { logoDataUrl, setLogoDataUrl } = useAppStore();
  const inputId = useId();
  const [preview, setPreview] = useState<string | undefined>(logoDataUrl);

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
    </div>
  );
}


