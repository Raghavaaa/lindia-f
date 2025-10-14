import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <div className="rounded-2xl bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 border border-black/5 dark:border-white/10 p-10 sm:p-16 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Junior AI for Indian Lawyers
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto mb-8">
          Your assistant for property opinions, research, case preparation, and more.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/research" className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-white bg-black hover:bg-zinc-800 w-full sm:w-auto">
            Start Research
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 w-full sm:w-auto">
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
