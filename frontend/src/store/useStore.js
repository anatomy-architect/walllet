import { create } from 'zustand';
import { api } from '../api/client';

export const useAuth = create((set) => ({
  user: null,
  admin: null,
  ready: false,

  init: async () => {
    try {
      const { user } = await api.me();
      set({ user });
    } catch { /* not logged in */ }
    try {
      const { admin } = await api.adminMe();
      set({ admin });
    } catch { /* not an admin session */ }
    set({ ready: true });
  },

  login: async (data) => {
    const { user } = await api.login(data);
    set({ user });
    return user;
  },
  register: async (data) => {
    const { user } = await api.register(data);
    set({ user });
    return user;
  },
  logout: async () => {
    await api.logout().catch(() => {});
    set({ user: null });
  },
  adminLogin: async (data) => {
    const { admin } = await api.adminLogin(data);
    set({ admin });
    return admin;
  },
  adminLogout: async () => {
    await api.adminLogout().catch(() => {});
    set({ admin: null });
  },
  setUser: (user) => set({ user }),
}));
