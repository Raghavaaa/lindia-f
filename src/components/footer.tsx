import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 shadow-sm">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 h-14 sm:h-16 px-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">
              Terms of Service
            </Link>
            <span className="hidden sm:inline">Contact: support@legalindia.ai</span>
            <span className="sm:hidden text-xs">support@legalindia.ai</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
