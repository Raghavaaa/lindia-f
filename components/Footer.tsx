import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-zinc-700 dark:text-zinc-300">
        <div className="flex items-center justify-between">
          <p>© {year} LegalIndia.ai</p>
          <nav className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/about" className="hover:underline">About</Link>
          </nav>
        </div>
        <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Weyou, Bengaluru, India • contact@legalindia.ai
        </div>
      </div>
    </footer>
  );
}


