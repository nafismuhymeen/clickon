import { create } from 'zustand';
import type { Link, Analytics, CreateLinkPayload, UpdateLinkPayload } from '@/types';
import { linksApi } from '@/lib/api';

interface LinkState {
  links: Link[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    totalClicks?: number;
  };
  totalClicks: number;
  isLoading: boolean;
  analyticsMap: Record<number, Analytics>;
  isAnalyticsLoading: boolean;

  fetchLinks: (page?: number, limit?: number, search?: string) => Promise<void>;
  addLink: (payload: CreateLinkPayload) => Promise<Link>;
  updateLink: (id: number, payload: UpdateLinkPayload) => Promise<Link>;
  deleteLink: (id: number) => Promise<void>;
  getAnalytics: (id: number) => Analytics;
  fetchAnalytics: (id: number) => Promise<Analytics>;
}

export const useLinkStore = create<LinkState>((set, get) => ({
  links: [],
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
    totalClicks: 0,
  },
  totalClicks: 0,
  isLoading: false,
  analyticsMap: {},
  isAnalyticsLoading: false,

  fetchLinks: async (page = 1, limit = 10, search?: string) => {
    set({ isLoading: true });
    try {
      const res = await linksApi.list({ page, limit, search });
      set({
        links: res.data,
        pagination: res.pagination,
        totalClicks: res.pagination.totalClicks ?? res.data.reduce((sum, l) => sum + (l.totalClicks ?? 0), 0),
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addLink: async (payload: CreateLinkPayload) => {
    const newLink = await linksApi.create(payload);
    set((state) => ({
      links: [newLink, ...state.links],
      pagination: {
        ...state.pagination,
        total: state.pagination.total + 1,
      },
    }));
    return newLink;
  },

  updateLink: async (id: number, payload: UpdateLinkPayload) => {
    const updated = await linksApi.update(id, payload);
    set((state) => ({
      links: state.links.map((link) => (link.id === id ? updated : link)),
    }));
    return updated;
  },

  deleteLink: async (id: number) => {
    await linksApi.delete(id);
    set((state) => ({
      links: state.links.filter((link) => link.id !== id),
      pagination: {
        ...state.pagination,
        total: Math.max(0, state.pagination.total - 1),
      },
    }));
  },

  getAnalytics: (id: number) => {
    return (
      get().analyticsMap[id] || {
        linkId: id,
        totalClicks: 0,
        uniqueCountries: 0,
        clicksToday: 0,
        clicksThisWeek: 0,
        topCountries: [],
        topDevices: [],
        topReferrers: [],
        clicksByDay: [],
      }
    );
  },

  fetchAnalytics: async (id: number) => {
    set({ isAnalyticsLoading: true });
    try {
      const data = await linksApi.getAnalytics(id);
      set((state) => ({
        analyticsMap: {
          ...state.analyticsMap,
          [id]: data,
        },
        isAnalyticsLoading: false,
      }));
      return data;
    } catch (err) {
      set({ isAnalyticsLoading: false });
      throw err;
    }
  },
}));
