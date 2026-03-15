export interface Supplier {
  id: number;
  document_number: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrder {
  id: number;
  order_number: string;
  supplier_id: number;
  supplier?: Supplier;
  user_id: number | null;
  date: string;
  total_amount: number;
  status: 'PENDING' | 'PENDING_RECEIPT' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
  purchase_order_details?: PurchaseOrderDetail[];
}

export interface PurchaseOrderDetail {
  id: number;
  purchase_order_id: number;
  product_id: number;
  quantity: number;
  unit_cost: number;
  subtotal: number;
}
