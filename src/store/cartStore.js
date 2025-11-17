import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],

  addItem: (menuItem, quantity = 1) => {
    const items = [...get().items];
    const idx = items.findIndex((i) => i.menu_id === menuItem.menu_id);
    if (idx >= 0) {
      items[idx].quantity += quantity;
    } else {
      items.push({ ...menuItem, quantity });
    }
    set({ items });
  },

  removeItem: (menu_id) => {
    set({ items: get().items.filter((i) => i.menu_id !== menu_id) });
  },

  updateQty: (menu_id, quantity) => {
    set({
      items: get().items.map((i) => (i.menu_id === menu_id ? { ...i, quantity } : i)),
    });
  },

  clear: () => set({ items: [] }),

  total: () => get().items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0),
}));


