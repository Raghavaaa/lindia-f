// /about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <main className="w-full max-w-3xl px-6 py-20">
        <div className="bg-white shadow-lg rounded-2xl p-10">
          <header className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold">About LegalIndia.AI</h1>
          </header>

          <section className="text-gray-700 leading-relaxed space-y-4 mb-8">
            <p>
              LegalIndia.AI provides lawyer-first tools for Property Opinions, Legal Research,
              Case Management and a Junior AI assistant tailored for Indian legal practice.
              The product focuses on fast, reliable outputs and a clean, secure workflow
              for practicing lawyers.
            </p>
            <p>
              This interface is front-end only — all research and inference connect to our
              backend AI engine. Use the app for quick drafts, client management, and
              structured legal research.
            </p>
          </section>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm shadow-sm hover:shadow-md"
            >
              Proceed to App
            </Link>
            <Link
              href="/"
              className="inline-block border border-gray-300 px-5 py-3 rounded-2xl text-sm hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
