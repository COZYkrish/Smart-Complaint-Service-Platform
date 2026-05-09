import { create } from 'zustand';
import api from '../services/api';

const useComplaintStore = create((set, get) => ({
  complaints: [],
  currentComplaint: null,
  stats: null,
  pagination: null,
  isLoading: false,
  error: null,
  filters: { status: '', priority: '', category: '', page: 1 },

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters, page: 1 } })),
  setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),

  fetchComplaints: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const { data } = await api.get(`/complaints?${params}`);
      set({ complaints: data.complaints, pagination: data.pagination, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch complaints.', isLoading: false });
    }
  },

  fetchComplaint: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/complaints/${id}`);
      set({ currentComplaint: data.complaint, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message, isLoading: false });
    }
  },

  createComplaint: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/complaints', payload);
      set((s) => ({ complaints: [data.complaint, ...s.complaints], isLoading: false }));
      return { success: true, complaint: data.complaint };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create complaint.';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  updateComplaint: async (id, payload) => {
    try {
      const { data } = await api.patch(`/complaints/${id}`, payload);
      set((s) => ({
        complaints: s.complaints.map((c) => (c._id === id ? data.complaint : c)),
        currentComplaint: s.currentComplaint?._id === id ? data.complaint : s.currentComplaint,
      }));
      return { success: true, complaint: data.complaint };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  },

  deleteComplaint: async (id) => {
    try {
      await api.delete(`/complaints/${id}`);
      set((s) => ({ complaints: s.complaints.filter((c) => c._id !== id) }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  },

  fetchStats: async () => {
    try {
      const { data } = await api.get('/complaints/stats');
      set({ stats: data.stats });
    } catch {
      // Silently fail for stats
    }
  },

  // Real-time additions from socket
  addComplaintFromSocket: (complaint) => {
    set((s) => {
      const exists = s.complaints.some((c) => c._id === complaint._id);
      if (exists) return s;
      return { complaints: [complaint, ...s.complaints] };
    });
  },

  updateComplaintFromSocket: (complaint) => {
    set((s) => ({
      complaints: s.complaints.map((c) => (c._id === complaint._id ? complaint : c)),
    }));
  },
}));

export default useComplaintStore;
