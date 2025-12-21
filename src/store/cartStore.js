import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Add item with optional notes and add-ons
      addItem: (menuItem, quantity = 1, notes = '', addons = []) => {
        const items = [...get().items];
        // Create unique key combining menu_id + notes + addons for custom orders
        const itemKey = `${menuItem.menu_id}-${notes}-${addons.map(a => a.menu_id).join(',')}`;
        
        const idx = items.findIndex((i) => i.itemKey === itemKey);
        if (idx >= 0) {
          items[idx].quantity += quantity;
        } else {
          items.push({ 
            ...menuItem, 
            quantity, 
            notes,
            addons,
            itemKey,
            // Calculate item total including add-ons
            addonsTotal: addons.reduce((sum, a) => sum + Number(a.price), 0)
          });
        }
        set({ items });
      },

      // Add item simple (for backward compatibility)
      addItemSimple: (menuItem, quantity = 1) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.menu_id === menuItem.menu_id && !i.notes && !i.addons?.length);
        if (idx >= 0) {
          items[idx].quantity += quantity;
        } else {
          items.push({ 
            ...menuItem, 
            quantity,
            notes: '',
            addons: [],
            itemKey: `${menuItem.menu_id}-simple`,
            addonsTotal: 0
          });
        }
        set({ items });
      },

      removeItem: (itemKey) => {
        set({ items: get().items.filter((i) => (i.itemKey || i.menu_id) !== itemKey) });
      },

      updateQty: (itemKey, quantity) => {
        set({
          items: get().items.map((i) => 
            (i.itemKey || i.menu_id) === itemKey ? { ...i, quantity } : i
          ),
        });
      },

      // Update notes for specific item
      updateNotes: (itemKey, notes) => {
        set({
          items: get().items.map((i) =>
            (i.itemKey || i.menu_id) === itemKey ? { ...i, notes } : i
          ),
        });
      },

      clear: () => set({ items: [] }),

      // Total including add-ons
      total: () => get().items.reduce((sum, i) => {
        const itemPrice = Number(i.price) + (i.addonsTotal || 0);
        return sum + itemPrice * i.quantity;
      }, 0),

      // Get item count
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'mj-kitchen-cart', // localStorage key
    }
  )
);
