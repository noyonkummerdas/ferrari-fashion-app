interface Stock {
  _id?: string;
  stock: number;
  note: string;
  openingStock: string;
  currentStock: string;
  type: string;
  product: string;
  status: string;
  user: string;
  warehouse: string;
}

export type { Stock };
