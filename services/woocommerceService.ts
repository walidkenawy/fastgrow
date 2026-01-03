
import { CartItem } from '../types';

/**
 * DEPRECATED: External WooCommerce integration has been cancelled.
 * All logic now handled internally in App.tsx using local archive.
 */

export const fetchWooCommerceProducts = async (): Promise<any[]> => {
  return [];
};

export const initiateExternalCheckout = (items: CartItem[]) => {
  console.log("External checkout cancelled. Use internal finalizing logic.");
};
