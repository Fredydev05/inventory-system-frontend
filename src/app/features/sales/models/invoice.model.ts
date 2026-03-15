export interface Invoice {
  id: number;
  invoice_number: string;
  customer_id: number;
  customer?: any;
  user_id: number | null;
  date: string;
  total_amount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  created_at: string;
  updated_at: string;
  invoice_details?: InvoiceDetail[];
}

export interface InvoiceDetail {
  id: number;
  invoice_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}
