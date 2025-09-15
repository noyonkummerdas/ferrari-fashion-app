interface Product {
  _id?: string;
  code: string;
  style: string;
  details: string;
  openingStock: number;
  currentStock: number;
  warehouse?: string;
  photo: string | null;
  status: string;
}

export type { Product };
