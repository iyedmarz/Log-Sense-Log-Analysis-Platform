import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type User = { email: string; name: string };
const AuthContext = createContext<{
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}>({ user: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored =
      typeof window !== 'undefined' && localStorage.getItem('logsense_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (email: string) => {
    const u = { email, name: email.split('@')[0] };
    localStorage.setItem('logsense_user', JSON.stringify(u));
    setUser(u);
  };
  const logout = () => {
    localStorage.removeItem('logsense_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
