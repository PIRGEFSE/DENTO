import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock users
const MOCK_USERS: (User & { password: string })[] = [
  { id: '1', nombre: 'Administrador', email: 'admin@utalca.cl', rol: 'administrador', password: 'admin123' },
  { id: '2', nombre: 'Docente Demo', email: 'docente@utalca.cl', rol: 'docente', password: 'docente123' },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        await new Promise(r => setTimeout(r, 800));
        const found = MOCK_USERS.find(u => u.email === email && u.password === password);
        if (found) {
          const { password: _, ...user } = found;
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'dentomax-auth' }
  )
);

