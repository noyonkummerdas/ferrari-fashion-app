export interface Sale {
    invoiceId: string;
    saleId: string;
    date: Date;
    amount: number;
    note: string;
    customerId: string;
    invoice: string;
    name: string;
    user?: string; // optional if userInfo?.id can be undefined
    warehouse?: string; // optional if userInfo?.warehouse can be undefined
    invoices?: string;
    status: "complete" | "deleted" | "cancle"; // adjust as per your app logic
  }

export default Sale;