import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaymentMethod {
  name: string;
  enabled: boolean;
}

interface SettingsState {
  storeName: string;
  businessType: string;
  licenseNumber: string;
  currency: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  invoicePrefix: string;
  invoiceSize: string;
  posScreen: string;
  vatEnabled: boolean;
  binNumber: string;
  vatPercentage: number;
  loyaltyEnabled: boolean;
  loyaltyAmount: number;
  paymentMethods: PaymentMethod[];
}

const initialState: SettingsState = {
  storeName: '',
  businessType: '',
  licenseNumber: '',
  currency: 'USD',
  email: '',
  phone: '',
  website: '',
  address: '',
  invoicePrefix: '',
  invoiceSize: '',
  posScreen: '',
  vatEnabled: false,
  binNumber: '',
  vatPercentage: 0,
  loyaltyEnabled: false,
  loyaltyAmount: 0,
  paymentMethods: [
    { name: 'bKash', enabled: false },
    { name: 'Nagad', enabled: false },
    { name: 'Visa', enabled: false },
    { name: 'MasterCard', enabled: false },
  ],
};
const settingSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSetting: (state, action: PayloadAction<{ key: keyof SettingsState; value: any }>) => {
      state[action.payload.key] = action.payload.value;
    },
    toggleVAT: (state) => {
      state.vatEnabled = !state.vatEnabled;
    },
    toggleLoyalty: (state) => {
      state.loyaltyEnabled = !state.loyaltyEnabled;
    },
    setPaymentMethods: (state, action: PayloadAction<PaymentMethod[]>) => {
      state.paymentMethods = action.payload;
    },
  },
});

export const { updateSetting, toggleVAT, toggleLoyalty, setPaymentMethods } = settingSlice.actions;
export default settingSlice.reducer;

