"use client";
import React, { useState } from "react";

export default function ClientModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (c: { name: string; phone?: string }) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3">New Client</h3>
        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Client name" className="input" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" className="input" />
          <div className="flex gap-3 justify-end">
            <button className="btn btn-secondary" onClick={() => { setName(""); setPhone(""); onClose(); }}>Cancel</button>
            <button className="btn btn-primary" onClick={() => { if (!name.trim()) return alert("Enter name"); onCreate({ name: name.trim(), phone: phone.trim() }); setName(""); setPhone(""); onClose(); }}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );
}
