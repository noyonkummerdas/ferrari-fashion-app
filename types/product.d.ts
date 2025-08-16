interface Product {
  _id: string;
  code: string;
  style: string;
  details: string;
  openingStock: number;
  currentStock: number;
  photo: string;
  status: string;
}

export type { Product };
