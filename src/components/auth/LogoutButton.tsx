"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  LogOut, 
  User, 
  Settings, 
  CreditCard, 
  HelpCircle,
  ChevronDown,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface LogoutButtonProps {
  variant?: "button" | "dropdown";
  showUserInfo?: boolean;
}

export default function LogoutButton({ 
  variant = "dropdown", 
  showUserInfo = true 
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Clear all client-related data
      localStorage.removeItem("legalindia_clients");
      localStorage.removeItem("legalindia_profile");
      
      // Clear any client-specific research data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('legalindia::client::') || key.startsWith('legalindia_clients_')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear session storage
      sessionStorage.clear();
      
      // Sign out from NextAuth
      await signOut({ 
        redirect: false,
        callbackUrl: "/"
      });
      
      // Redirect to home page
      router.push("/");
      router.refresh();
      
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if cleanup fails
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const displayName = user.name || user.email || "User";
  const userInitials = displayName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (variant === "button") {
    return (
      <Button
        onClick={handleLogout}
        variant="ghost"
        size="sm"
        className="gap-2"
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">Sign Out</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
            {user.image ? (
              <img
                src={user.image}
                alt={displayName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              userInitials
            )}
          </div>
          {showUserInfo && (
            <>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-foreground">{displayName}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/app/profile")}>
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/app/settings")}>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/app/billing")}>
          <CreditCard className="w-4 h-4 mr-2" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/help")}>
          <HelpCircle className="w-4 h-4 mr-2" />
          Help & Support
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-red-600 focus:text-red-600"
        >
          {isLoggingOut ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 mr-2" />
          )}
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
