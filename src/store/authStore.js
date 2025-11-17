// client/src/store/authStore.js
import { create } from 'zustand';
import { supabase, signOut } from '../services/supabase';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  profile: null,
  loading: true,

  init: async () => {
    set({ loading: true });
    try {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (session?.access_token) {
        set({ user: session.user, token: session.access_token });
        localStorage.setItem('token', session.access_token);
        const resp = await api.get('/users/me');
        set({ profile: resp.data });
        
      }
    } catch (e) {
      console.error('Error in auth init:', e);
    } finally {
      set({ loading: false });
    }
  },

  setSession: async (session) => {
    set({ loading: true });
    try {
      const token = session?.access_token || null;
      set({ user: session?.user || null, token });
      if (token) {
        localStorage.setItem('token', token);
        const resp = await api.get('/users/me');
        set({ profile: resp.data });

      } else {
        localStorage.removeItem('token');
        set({ profile: null });
      }
    } catch (e) {
      console.error('Error in setSession:', e);
    } finally {
      set({ loading: false });
    }
  },

  setProfile: (newProfileData) => {
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...newProfileData } : newProfileData,
    }));
  },
  
  logout: async () => {
    await signOut();
    localStorage.removeItem('token');
    set({ user: null, token: null, profile: null, loading: false });
  },
}));