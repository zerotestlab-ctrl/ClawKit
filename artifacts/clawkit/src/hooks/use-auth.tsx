import { createContext, useContext, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetCurrentUser, 
  useLogin, 
  useRegister, 
  useLogout,
  getGetCurrentUserQueryKey,
  type User,
  type LoginRequest,
  type RegisterRequest
} from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useGetCurrentUser({
    query: {
      queryKey: getGetCurrentUserQueryKey(),
      retry: false,
      staleTime: Infinity,
    }
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data: any) => {
        if (data?.token) localStorage.setItem("clawkit_token", data.token);
        queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
        setLocation("/dashboard");
        toast({ title: "Welcome back", description: "Successfully logged in to ClawKit." });
      },
      onError: (error: any) => {
        toast({ variant: "destructive", title: "Login failed", description: error.message || "Invalid credentials" });
      }
    }
  });

  const registerMutation = useRegister({
    mutation: {
      onSuccess: (data: any) => {
        if (data?.token) localStorage.setItem("clawkit_token", data.token);
        queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
        setLocation("/dashboard");
        toast({ title: "Account created", description: "Welcome to ClawKit!" });
      },
      onError: (error: any) => {
        toast({ variant: "destructive", title: "Registration failed", description: error.message || "Email may be taken" });
      }
    }
  });

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        localStorage.removeItem("clawkit_token");
        queryClient.clear();
        setLocation("/");
        toast({ title: "Logged out", description: "You have been logged out successfully." });
        window.location.href = "/";
      },
      onSettled: () => {
        localStorage.removeItem("clawkit_token");
        queryClient.setQueryData(getGetCurrentUserQueryKey(), null);
      }
    }
  });

  return (
    <AuthContext.Provider value={{
      user: user || null,
      isLoading,
      login: async (data) => { await loginMutation.mutateAsync({ data }); },
      register: async (data) => { await registerMutation.mutateAsync({ data }); },
      logout: async () => { await logoutMutation.mutateAsync(); }
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
