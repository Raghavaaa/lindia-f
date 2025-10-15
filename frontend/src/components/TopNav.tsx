"use client";
import React from "react";

export default function TopNav({ active, onSelect }: { active: string; onSelect?: (m: string) => void }) {
  const modules = ["Property Opinion", "Research", "Case", "Junior"];
  return (
    <div className="w-full border-b border-gray-100 bg-white">
      <div className="container flex items-center justify-between py-3">
        <div className="text-sm text-gray-700">
          <span className="font-medium">LegalIndia.AI</span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {modules.map((m) => (
            <button
              key={m}
              onClick={() => onSelect?.(m)}
              className={`text-sm px-3 py-2 rounded-full ${active === m ? "bg-brand-50 text-brand-700" : "hover:bg-gray-50"}`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="md:hidden">
          {/* placeholder for mobile menu */}
        </div>
      </div>
    </div>
  );
}
