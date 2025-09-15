import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StockItem {
  product: string;
  stock: number;
  note: string;
  type: string;
  status: string;
  user: string;
  warehouse: string;
}

interface StockState {
  stockItem: StockItem;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  successMessage: string;
}

const initialState: StockState = {
  stockItem: {
    product: "",
    stock: 0,
    note: "",
    type: "",
    status: "active",
    user: "",
    warehouse: "",
  },
  isLoading: false,
  error: null,
  success: false,
  successMessage: "",
};

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    // Set stock item data
    setStockItem: (state, action: PayloadAction<Partial<StockItem>>) => {
      state.stockItem = { ...state.stockItem, ...action.payload };
    },

    // Reset stock item to initial state
    resetStockItem: (state) => {
      state.stockItem = initialState.stockItem;
    },

    // Set stock type (stockIn or stockOut)
    setStockType: (state, action: PayloadAction<string>) => {
      state.stockItem.type = action.payload;
    },

    // Update stock quantity
    updateStockQuantity: (state, action: PayloadAction<number>) => {
      state.stockItem.stock = action.payload || 0;
    },

    // Update note
    updateNote: (state, action: PayloadAction<string>) => {
      state.stockItem.note = action.payload;
    },

    // Calculate and update current stock based on type
    // updateCurrentStock: (
    //   state,
    //   action: PayloadAction<{
    //     baseStock: number;
    //     operation: "add" | "subtract";
    //   }>,
    // ) => {
    //   const { baseStock, operation } = action.payload;
    //   // if (operation === "add") {
    //   //   state.stockItem.currentStock = baseStock + state.stockItem.stock;
    //   // } else {
    //   //   state.stockItem.currentStock = Math.max(
    //   //     0,
    //   //     baseStock - state.stockItem.stock,
    //   //   );
    //   // }
    // },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.success = false;
    },

    // Set success
    setSuccess: (
      state,
      action: PayloadAction<{ success: boolean; message: string }>,
    ) => {
      state.success = action.payload.success;
      state.successMessage = action.payload.message;
      state.error = null;
    },

    // Clear success
    clearSuccess: (state) => {
      state.success = false;
      state.successMessage = "";
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setStockItem,
  resetStockItem,
  setStockType,
  updateStockQuantity,
  updateNote,
  // updateCurrentStock,
  setLoading,
  setError,
  setSuccess,
  clearSuccess,
  clearError,
} = stockSlice.actions;

export default stockSlice.reducer;
