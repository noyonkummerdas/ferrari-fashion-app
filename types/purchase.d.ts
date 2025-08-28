export interface Purchase {
    invoiceId: string;
    poId?: string;
    amount: number;
    // saleId?: string;
    date: Date;
    amount: number;
    note: string;
    photo: string;
    supplireId: string;
    user?: string; // optional if userInfo?.id can be undefined
    warehouse?: string; // optional if userInfo?.warehouse can be undefined
    status: "complete" | "deleted" | "cancle"; // adjust as per your app logic
  }

export default Purchase;

