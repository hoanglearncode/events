export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string;
  parent_id: number | null;
  status: CategoryStatus;
  total?: number;
  created_at?: string;
  updated_at?: string;
}
