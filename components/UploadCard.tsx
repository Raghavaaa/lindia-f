"use client";
import { useId, useState } from "react";

export default function UploadCard() {
  const inputId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setMessage(null);
    if (!apiUrl) {
      setMessage("Missing NEXT_PUBLIC_API_URL");
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setMessage("Please choose a file to upload.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Upload failed with status ${response.status}`);
      }
      setMessage("Upload successful.");
      form.reset();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6">
      <h3 className="text-lg font-semibold mb-2">Upload</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Upload documents to process within Directories.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <label htmlFor={inputId} className="text-sm w-24">File</label>
          <input id={inputId} name="file" type="file" className="block w-full text-sm" />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting || !apiUrl}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white bg-black hover:bg-zinc-800 disabled:opacity-60"
          >
            {isSubmitting ? "Uploading..." : apiUrl ? "Upload" : "Upload (API URL missing)"}
          </button>
        </div>
        {message && (
          <div className="text-sm text-zinc-700 dark:text-zinc-300">{message}</div>
        )}
      </form>
    </div>
  );
}


