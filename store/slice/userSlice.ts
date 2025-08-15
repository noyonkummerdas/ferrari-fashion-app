import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  name: string;
  phone: string;
  warehouse: string;
  isLoggedIn: boolean;
  type: string;
  email: string;
  token?: string;
}

const initialState: UserState = {
  id: "",
  name: "",
  phone: "",
  warehouse: "",
  isLoggedIn: false,
  type: "staff",
  email: "",
  token: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<Partial<UserState>>) => {
      console.log("user Slice Payload:", action.payload);
      return {
        ...state,
        ...action.payload,
      };
    },
    loginUser: (state, action: PayloadAction<UserState>) => {
      return {
        ...state,
        ...action.payload,
        isLoggedIn: true,
      };
    },
    logoutUser: (state) => {
      return {
        ...initialState,
        isLoggedIn: false,
      };
    },
    clearUserData: (state) => {
      return initialState;
    },
  },
});

// Export the actions to use them in your components
export const { setUserInfo, loginUser, logoutUser, clearUserData } =
  userSlice.actions;

// Export the reducer to use it in the store
export default userSlice.reducer;
