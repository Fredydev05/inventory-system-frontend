export interface Customer {
  id: number;
  document_number: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  credit_limit: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  invoices?: any[];
}
