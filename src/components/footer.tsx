import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-center h-14 px-4">
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-900">
              Terms of Service
            </Link>
            <span>Contact: support@legalindia.ai</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
