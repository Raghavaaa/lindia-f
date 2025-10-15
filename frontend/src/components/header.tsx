"use client";
import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="container" style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        height: "100%"
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center",
            gap: 8
          }}>
            <div style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #2E7CF6 0%, #1E5CD0 100%)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: 18
            }}>
              L
            </div>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1F2937",
              fontFamily: "var(--font-heading)"
            }}>
              LegalIndia.AI
            </div>
          </div>
        </Link>

                {/* Right side: About and Settings */}
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 12
                }}>
                  {/* About Button */}
                  <Link href="/about" style={{ textDecoration: "none" }}>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 14px",
                        borderRadius: 18,
                        border: "1px solid #E6E9EE",
                        background: "#FFFFFF",
                        color: "#6B7280",
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#E8F1FF";
                        e.currentTarget.style.color = "#2E7CF6";
                        e.currentTarget.style.borderColor = "#2E7CF6";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#FFFFFF";
                        e.currentTarget.style.color = "#6B7280";
                        e.currentTarget.style.borderColor = "#E6E9EE";
                      }}
                      aria-label="About"
                    >
                      <span className="hidden sm:inline">About</span>
                    </button>
                  </Link>

                  {/* Settings Button */}
                  <Link href="/settings" style={{ textDecoration: "none" }}>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 14px",
                        borderRadius: 18,
                        border: "1px solid #E6E9EE",
                        background: "#FFFFFF",
                        color: "#6B7280",
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#E8F1FF";
                        e.currentTarget.style.color = "#2E7CF6";
                        e.currentTarget.style.borderColor = "#2E7CF6";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#FFFFFF";
                        e.currentTarget.style.color = "#6B7280";
                        e.currentTarget.style.borderColor = "#E6E9EE";
                      }}
                      aria-label="Settings"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M13 8C13 8.26 13 8.52 12.96 8.78L14.54 10.04C14.68 10.14 14.72 10.34 14.62 10.5L13.14 13C13.04 13.16 12.84 13.22 12.66 13.16L10.82 12.42C10.42 12.72 9.98 12.96 9.5 13.14L9.24 15.08C9.22 15.28 9.04 15.42 8.84 15.42H5.88C5.68 15.42 5.5 15.28 5.48 15.08L5.22 13.14C4.74 12.96 4.3 12.72 3.9 12.42L2.06 13.16C1.88 13.22 1.68 13.16 1.58 13L0.1 10.5C0 10.34 0.04 10.14 0.18 10.04L1.76 8.78C1.72 8.52 1.72 8.26 1.72 8C1.72 7.74 1.72 7.48 1.76 7.22L0.18 5.96C0.04 5.86 0 5.66 0.1 5.5L1.58 3C1.68 2.84 1.88 2.78 2.06 2.84L3.9 3.58C4.3 3.28 4.74 3.04 5.22 2.86L5.48 0.92C5.5 0.72 5.68 0.58 5.88 0.58H8.84C9.04 0.58 9.22 0.72 9.24 0.92L9.5 2.86C9.98 3.04 10.42 3.28 10.82 3.58L12.66 2.84C12.84 2.78 13.04 2.84 13.14 3L14.62 5.5C14.72 5.66 14.68 5.86 14.54 5.96L12.96 7.22C13 7.48 13 7.74 13 8Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      <span className="hidden sm:inline">Settings</span>
                    </button>
                  </Link>
        </div>
      </div>
    </header>
  );
}