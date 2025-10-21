import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-14 sm:h-16 px-4">
          {/* Logo Text - Unified font */}
          <Link href="/" className="text-base sm:text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors">
            Legal India.ai
          </Link>

          {/* Navigation - Unified font */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:inline">
              Home
            </Link>
            <Link href="/about" className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors hidden md:inline">
              Contact
            </Link>
            <Link href="/login" className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Go to App
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
