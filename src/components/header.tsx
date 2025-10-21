import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-14 sm:h-16 px-4">
          {/* Logo Text */}
          <Link href="/" className="text-base sm:text-lg font-bold text-gray-900 hover:text-gray-700 transition-colors font-sans">
            Legal India.ai
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors hidden sm:inline font-sans">
              Home
            </Link>
            <Link href="/about" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-sans">
              About
            </Link>
            <Link href="/contact" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors hidden md:inline font-sans">
              Contact
            </Link>
            <Button asChild size="sm" className="text-sm px-3 sm:px-4 font-sans">
              <Link href="/login">Login</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
