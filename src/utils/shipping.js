// Shipping rate calculator utility for MJ Kitchen
// Based on quantity-based free shipping rules

/**
 * Shipping rate tiers based on total quantity
 * - < 10 items: Rp 10,000
 * - 10-49 items: Rp 5,000
 * - 50-99 items: Free
 * - >= 100 items: Free + Priority delivery
 */

export const SHIPPING_TIERS = [
  { minQty: 100, maxQty: Infinity, fee: 0, label: 'Gratis Ongkir + Prioritas', color: 'text-green-600' },
  { minQty: 50, maxQty: 99, fee: 0, label: 'Gratis Ongkir', color: 'text-green-600' },
  { minQty: 10, maxQty: 49, fee: 5000, label: 'Ongkir Hemat', color: 'text-blue-600' },
  { minQty: 1, maxQty: 9, fee: 10000, label: 'Ongkir Standar', color: 'text-gray-600' },
];

/**
 * Calculate shipping fee based on total quantity
 * @param {number} totalQuantity - Total number of items in cart
 * @returns {{ fee: number, label: string, color: string, nextTierInfo: string | null }}
 */
export function calculateShipping(totalQuantity) {
  const tier = SHIPPING_TIERS.find(t => totalQuantity >= t.minQty && totalQuantity <= t.maxQty) 
    || SHIPPING_TIERS[SHIPPING_TIERS.length - 1];
  
  // Calculate how many more items needed for next tier
  let nextTierInfo = null;
  const tierIndex = SHIPPING_TIERS.indexOf(tier);
  
  if (tierIndex > 0) {
    const nextTier = SHIPPING_TIERS[tierIndex - 1];
    const itemsNeeded = nextTier.minQty - totalQuantity;
    if (nextTier.fee < tier.fee) {
      nextTierInfo = `Tambah ${itemsNeeded} item untuk ${nextTier.label}`;
    }
  }
  
  return {
    fee: tier.fee,
    label: tier.label,
    color: tier.color,
    nextTierInfo
  };
}

/**
 * Format shipping info for display
 * @param {number} fee - Shipping fee in Rupiah
 * @returns {string}
 */
export function formatShippingFee(fee) {
  if (fee === 0) return 'Gratis';
  return `Rp ${fee.toLocaleString()}`;
}

/**
 * Calculate total quantity from cart items
 * @param {Array} items - Cart items array
 * @returns {number}
 */
export function getTotalQuantity(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export default {
  calculateShipping,
  formatShippingFee,
  getTotalQuantity,
  SHIPPING_TIERS
};
