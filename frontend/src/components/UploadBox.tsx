"use client";
import React, { useCallback, useState } from "react";

export default function UploadBox() {
  const [hover, setHover] = useState(false);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setHover(false);
    const files = Array.from(e.dataTransfer.files).map((f) => f.name);
    // Demo-only: show the file names
    if (files.length) alert(`Files dropped (demo):\n• ${files.join("\n• ")}`);
  }, []);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={onDrop}
      role="region"
      aria-label="Upload files"
      className={`upload ${hover ? "bg-[#E8F1FF] border-[#A6CDFD]" : ""}`}
      style={{ cursor: "pointer" }}
    >
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Upload Files</div>
      <div style={{ color: "#6B7280", marginBottom: 14 }}>Drag & drop files here, or click to browse (demo only)</div>
      <div>
        <button className="btn btn-ghost">Browse</button>
      </div>
    </div>
  );
}