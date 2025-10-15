// app/page.tsx  — Visual Polish Version
import Link from "next/link";
import { Building2, Search, FileText, Bot } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Slim Header */}
      <header className="header">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-neutral-900">LegalIndia.AI</span>
            </div>
            <Link href="/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>
      </header>

      {/* Module Navigation */}
      <nav className="bg-white border-b border-neutral-200 py-3">
        <div className="container">
          <div className="flex items-center justify-center gap-6">
            <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-full hover:bg-neutral-100 transition-colors">
              <Building2 className="w-4 h-4 text-brand-primary" />
              Property Opinion
            </button>
            <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-full hover:bg-neutral-100 transition-colors">
              <Search className="w-4 h-4 text-brand-primary" />
              Research
            </button>
            <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-full hover:bg-neutral-100 transition-colors">
              <FileText className="w-4 h-4 text-brand-primary" />
              Case
            </button>
            <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-full hover:bg-neutral-100 transition-colors">
              <Bot className="w-4 h-4 text-brand-primary" />
              Junior
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container max-w-4xl">
          <div className="text-center">
            <h1 className="mb-10">Junior.AI for Indian Lawyers</h1>

            <div className="flex items-center justify-center gap-4">
              <Link href="/about" className="btn btn-primary">Get Started</Link>
              <Link href="/login" className="btn btn-secondary">Login</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="text-center text-sm text-neutral-500">
            © 2025 LegalIndia.AI. All Rights Reserved.
          </div>
        </div>
      </footer>
      </div>
  );
}
