"use client";
import React, { useState, useEffect, useRef } from "react";

export default function ClientModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (c: { name: string; phone?: string }) => void; }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setPhone("");
      setTimeout(() => nameRef.current?.focus(), 80);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="client-modal" style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 12px 40px rgba(10,15,25,0.12)" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Create new client</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input ref={nameRef} className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Client name" />
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!name.trim()) return alert("Please enter a client name");
                onCreate({ name: name.trim(), phone: phone.trim() || undefined });
                onClose();
              }}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}