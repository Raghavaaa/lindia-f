"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Settings } from "lucide-react";
import { Suspense } from "react";

function HeaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentModule = searchParams?.get("module") || "research";
  const { user, isAuthenticated } = useAuth();
  const isAppPage = pathname?.startsWith('/app');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col">
          {/* Top Row - Logo and User Info */}
          <div className="flex items-center justify-between h-14 sm:h-16 px-4">
            {/* Logo Text */}
            <Link href="/" className="text-base sm:text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              Legal India.ai
            </Link>

            {/* Navigation - Show different items based on auth state */}
            {!isAuthenticated || !isAppPage ? (
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
            ) : (
              <div className="flex items-center gap-3 sm:gap-4">
                {/* User Name */}
                {user && (
                  <span className="text-sm sm:text-base font-medium text-gray-900 hidden sm:inline">
                    {user.name || user.email}
                  </span>
                )}
                {/* Settings Link */}
                <Link 
                  href="/settings" 
                  className="flex items-center gap-1.5 text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
              </div>
            )}
          </div>

          {/* Second Row - Module Tabs (only show when logged in and on app page) */}
          {isAuthenticated && isAppPage && (
            <div className="border-t border-gray-200">
              <nav className="flex items-center justify-end gap-1 px-4 overflow-x-auto">
                <Link
                  href="/app?module=research"
                  className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    currentModule === 'research'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  Legal Research
                </Link>
                <Link
                  href="/app?module=property"
                  className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    currentModule === 'property'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  Property Opinion
                </Link>
                <Link
                  href="/app?module=case"
                  className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    currentModule === 'case'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  Case
                </Link>
                <Link
                  href="/app?module=junior"
                  className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    currentModule === 'junior'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  Junior
                </Link>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-14 sm:h-16 px-4">
            <div className="text-base sm:text-lg font-semibold text-gray-900">Legal India.ai</div>
          </div>
        </div>
      </header>
    }>
      <HeaderContent />
    </Suspense>
  );
}
