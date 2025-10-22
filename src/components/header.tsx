"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

function HeaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentModule = searchParams?.get("module") || "research";
  const { user, isAuthenticated, logout } = useAuth();
  const isDashboardPage = pathname?.startsWith('/dashboard');
  const isAppPage = pathname?.startsWith('/app') || pathname?.startsWith('/dashboard') || pathname?.startsWith('/settings') || pathname?.startsWith('/history') || pathname?.startsWith('/research');
  const isPublicPage = pathname === '/' || pathname === '/about' || pathname === '/login';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col">
          {/* Top Row - Logo and Navigation */}
          <div className="flex items-center justify-between h-14 sm:h-16 px-4">
            {/* Logo Text */}
            <Link href="/" className="text-base sm:text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              Legal India.ai
            </Link>

            {/* Navigation - Show different items based on auth state and page type */}
            <nav className="flex items-center gap-3 sm:gap-6">
              {isAuthenticated ? (
                <>
                  {/* Logged in navigation */}
                  {isAppPage ? (
                    <>
                      {/* SaaS App Navigation */}
                      <Link 
                        href="/dashboard" 
                        className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        href="/about" 
                        className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        About
                      </Link>
                      <Link 
                        href="/settings" 
                        className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Settings
                      </Link>
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors h-auto p-0"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* Public Page Navigation (when logged in) */}
                      <Link 
                        href="/dashboard" 
                        className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        href="/about" 
                        className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        About
                      </Link>
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors h-auto p-0"
                      >
                        Logout
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Logged out navigation */}
                  <Link 
                    href="/about" 
                    className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    About
                  </Link>
                  <Link 
                    href="/login" 
                    className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Login
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Second Row - Module Tabs (only show when logged in and on dashboard page) */}
          {isAuthenticated && isDashboardPage && (
            <div className="border-t border-gray-200">
              <nav className="flex items-center justify-end gap-1 px-4 overflow-x-auto">
                <Link
                  href="/dashboard?module=research"
                  className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    currentModule === 'research'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  Legal Research
                </Link>
                <Link
                  href="/dashboard?module=property"
                  className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    currentModule === 'property'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  Property Opinion
                </Link>
                <Link
                  href="/dashboard?module=case"
                  className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    currentModule === 'case'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  Case
                </Link>
                <Link
                  href="/dashboard?module=junior"
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
