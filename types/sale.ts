export interface Sale {
    invoiceId: string;
    saleId?: string;
    date: Date;
    amount: number;
    note: string;
    customerId: string;
    user?: string; // optional if userInfo?.id can be undefined
    warehouse?: string; // optional if userInfo?.warehouse can be undefined
    status: "complete" | "deleted" | "cancle"; // adjust as per your app logic
  }

export default Sale;