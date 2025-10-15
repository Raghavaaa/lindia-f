"use client";
import React from "react";

export default function Header() {
  return (
    <header className="header">
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#1F2937"
          }}>
            LegalIndia.AI
          </div>
        </div>

        {/* Right side utility area */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Profile/Login icon */}
          <button
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid #E6E9EE",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "#6B7280"
            }}
            aria-label="Profile/Login"
          >
            👤
          </button>

          {/* Mobile menu icon (hidden on desktop) */}
          <button
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid #E6E9EE",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "#6B7280"
            }}
            className="md:hidden"
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
