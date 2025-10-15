"use client";
import React, { useCallback, useState } from "react";

export default function UploadBox() {
  const [hover, setHover] = useState(false);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setHover(false);
    // show demo behavior only
    const files = Array.from(e.dataTransfer.files).map((f) => ({ name: f.name, size: f.size }));
    alert(`Dropped ${files.length} file(s). Demo only.`);
  }, []);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={onDrop}
      className={`w-full rounded-2xl border-2 ${hover ? "border-dashed border-brand-300 bg-brand-50" : "border-dashed border-gray-200"} p-10 text-center`}
      style={{ minHeight: 180 }}
    >
      <div className="text-lg font-medium mb-2">Upload Files</div>
      <div className="text-sm text-gray-500">Drag & drop or click to select (demo only)</div>
      <div className="mt-4">
        <button className="btn btn-secondary">Browse</button>
      </div>
    </div>
  );
}
