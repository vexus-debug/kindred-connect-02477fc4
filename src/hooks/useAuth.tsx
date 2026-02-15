import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthUser {
  id: string;
  email: string;
}

interface AuthProfile {
  full_name: string;
  phone?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: AuthProfile | null;
  session: boolean;
  roles: string[];
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: false,
  roles: [],
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser({ id: "local-user", email: parsed.email });
      } catch {}
    }
    setLoading(false);
  }, []);

  const signOut = async () => {
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: user ? { full_name: user.email.split("@")[0] } : null,
        session: !!user,
        roles: user ? ["admin"] : [],
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
