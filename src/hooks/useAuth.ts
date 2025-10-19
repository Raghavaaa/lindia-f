"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async (provider?: string) => {
    if (provider === 'google') {
      await signIn('google', { callbackUrl: '/app' });
    } else {
      await signIn();
    }
  };

  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isAuthenticated = !!session;
  const isLoading = status === 'loading';
  const user = session?.user;

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
