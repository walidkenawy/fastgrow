
import { OrderPayload } from './orderService';

/**
 * THE NOBEL SPIRIT MASTER SHEET SERVICE
 * Mimics a Google Sheet / AppSheet Data Source
 */

export interface SheetRow {
  id: string;
  timestamp: string;
  customer: string;
  email: string;
  product: string;
  total: string;
  status: 'Pending' | 'Processed' | 'Failed';
}

const STORAGE_KEY = 'nobel_spirit_master_sheet';

export const getMasterSheetData = (): SheetRow[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const appendOrderToSheet = (order: OrderPayload): SheetRow => {
  const currentData = getMasterSheetData();
  const newRow: SheetRow = {
    id: `ROW-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    customer: order.client.fullName,
    email: order.client.email,
    product: order.items.map(i => i.product.name).join(', '),
    total: `${order.total} ${order.currency.code}`,
    status: 'Pending'
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newRow, ...currentData]));
  return newRow;
};

export const updateRowStatus = (id: string, status: SheetRow['status']) => {
  const currentData = getMasterSheetData();
  const updated = currentData.map(row => row.id === id ? { ...row, status } : row);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
