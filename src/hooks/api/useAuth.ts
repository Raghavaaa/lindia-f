import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/api';
import { LoginRequest, RegisterRequest } from '@/services/api/types';
import { useRouter } from 'next/navigation';

// Query keys for caching
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'current-user'] as const,
};

// Get current user
export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authService.getCurrentUser(),
    enabled: enabled && authService.isAuthenticated(),
    retry: false,
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      router.push('/');
    },
  });
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      router.push('/');
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      router.push('/login');
    },
  });
}

// Refresh token mutation
export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.currentUser(), data.user);
    },
  });
}

// Check if user is authenticated
export function useIsAuthenticated() {
  return authService.isAuthenticated();
}

// Get stored user
export function useStoredUser() {
  return authService.getStoredUser();
}

