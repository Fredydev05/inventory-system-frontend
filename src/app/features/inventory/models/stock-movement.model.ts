export interface StockMovement {
  id: number;
  product_id: number;
  product?: any;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  date: string;
  reference: string | null;
  user_id: number | null;
  user?: any;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
