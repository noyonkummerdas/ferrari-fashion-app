export interface Transaction {
  _id?: string;
  code?: string;
  customerId?: string;
  supplierId?: string;
  name?: string;
  user: string;
  warehouse: string;
  amount: number;
  openingBalance: number;
  currentBalance: number;
  photo?: string;
  invoices?: string;
  note?: string;
  date: string;
  type: "paymentReceived" | "payment" | "deposit" | "cashOut";
  status: "complete" | "cancel" | "deleted";
}
