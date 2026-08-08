import { create } from 'zustand';
import type { Link, Analytics } from '@/types';

export const INITIAL_LINKS: Link[] = [
  {
    id: 1,
    shortCode: 'tech-launch-2026',
    shortUrl: 'http://localhost:5000/r/tech-launch-2026',
    originalUrl: 'https://github.com/nafis/clickon-monorepo',
    customSlug: 'tech-launch-2026',
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    totalClicks: 1420,
  },
  {
    id: 2,
    shortCode: 'summer-sale',
    shortUrl: 'http://localhost:5000/r/summer-sale',
    originalUrl: 'https://store.clickon.io/campaigns/summer-2026',
    customSlug: 'summer-sale',
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    totalClicks: 890,
  },
  {
    id: 3,
    shortCode: 'product-demo',
    shortUrl: 'http://localhost:5000/r/product-demo',
    originalUrl: 'https://youtube.com/watch?v=demo12345',
    customSlug: 'product-demo',
    isActive: false,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    totalClicks: 310,
  },
];

export const INITIAL_ANALYTICS: Record<number, Analytics> = {
  1: {
    linkId: 1,
    totalClicks: 1420,
    uniqueCountries: 18,
    clicksToday: 245,
    clicksThisWeek: 870,
    topCountries: [
      { country: 'United States', count: 520 },
      { country: 'Germany', count: 280 },
      { country: 'United Kingdom', count: 210 },
      { country: 'Japan', count: 160 },
      { country: 'Canada', count: 125 },
    ],
    topDevices: [
      { device: 'Desktop (Chrome)', count: 810 },
      { device: 'Mobile (Safari)', count: 430 },
      { device: 'Tablet', count: 180 },
    ],
    topReferrers: [
      { referrer: 'Twitter / X', count: 590 },
      { referrer: 'Direct / Bookmark', count: 410 },
      { referrer: 'LinkedIn', count: 260 },
      { referrer: 'Google Search', count: 160 },
    ],
    clicksByDay: [
      { date: 'Mon', count: 120 },
      { date: 'Tue', count: 180 },
      { date: 'Wed', count: 240 },
      { date: 'Thu', count: 310 },
      { date: 'Fri', count: 290 },
      { date: 'Sat', count: 140 },
      { date: 'Sun', count: 140 },
    ],
  },
  2: {
    linkId: 2,
    totalClicks: 890,
    uniqueCountries: 12,
    clicksToday: 110,
    clicksThisWeek: 450,
    topCountries: [
      { country: 'United States', count: 320 },
      { country: 'France', count: 190 },
      { country: 'Canada', count: 150 },
    ],
    topDevices: [
      { device: 'Mobile (iOS)', count: 540 },
      { device: 'Desktop', count: 350 },
    ],
    topReferrers: [
      { referrer: 'Instagram', count: 480 },
      { referrer: 'Direct', count: 290 },
      { referrer: 'Email Newsletter', count: 120 },
    ],
    clicksByDay: [
      { date: 'Mon', count: 80 },
      { date: 'Tue', count: 95 },
      { date: 'Wed', count: 130 },
      { date: 'Thu', count: 160 },
      { date: 'Fri', count: 210 },
      { date: 'Sat', count: 115 },
      { date: 'Sun', count: 100 },
    ],
  },
};

interface LinkState {
  links: Link[];
  analyticsMap: Record<number, Analytics>;
  addLink: (payload: { originalUrl: string; customSlug?: string }) => Link;
  updateLink: (id: number, payload: Partial<Link>) => void;
  deleteLink: (id: number) => void;
  getAnalytics: (id: number) => Analytics;
}

export const useLinkStore = create<LinkState>((set, get) => ({
  links: INITIAL_LINKS,
  analyticsMap: INITIAL_ANALYTICS,

  addLink: ({ originalUrl, customSlug }) => {
    const slug = customSlug || Math.random().toString(36).substring(2, 8);
    const newLink: Link = {
      id: Date.now(),
      shortCode: slug,
      shortUrl: `http://localhost:5000/r/${slug}`,
      originalUrl,
      customSlug: customSlug || undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
      totalClicks: 0,
    };
    set((state) => ({ links: [newLink, ...state.links] }));
    return newLink;
  },

  updateLink: (id, payload) => {
    set((state) => ({
      links: state.links.map((link) => (link.id === id ? { ...link, ...payload } : link)),
    }));
  },

  deleteLink: (id) => {
    set((state) => ({
      links: state.links.filter((link) => link.id !== id),
    }));
  },

  getAnalytics: (id) => {
    return get().analyticsMap[id] || {
      linkId: id,
      totalClicks: 0,
      uniqueCountries: 0,
      clicksToday: 0,
      clicksThisWeek: 0,
      topCountries: [],
      topDevices: [],
      topReferrers: [],
      clicksByDay: [],
    };
  },
}));
