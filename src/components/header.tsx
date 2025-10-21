import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link href="/" className="text-lg font-bold text-gray-900">
            Legal India
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Button asChild size="sm">
              <Link href="/login">Login</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
