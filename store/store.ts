import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";

// Example slice reducer (you can replace this with your actual slice)
import BrandApi from "./api/brandApi";
import CategoryApi from "./api/categoryApi";
import CustomerApi from "./api/customerApi";
import InventoryApi from "./api/inventoryApi";
import ProductApi from "./api/productApi";
import SaleApi from "./api/saleApi";
import SearchApi from "./api/searchApi";
import SettingApi from "./api/settingApi";
import SupplierApi from "./api/supplierApi";
import UploadApi from "./api/uploadApi";
import UserApi from "./api/userApi";
import { posReducer } from "./slice/posSlice";
import settingReducer from "./slice/settingSlice";
import userReducer from "./slice/userSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["pos"],
};

const rootReducers = combineReducers({
  user: userReducer,
  pos: posReducer,
  setting: settingReducer,
  [UserApi.reducerPath]: UserApi.reducer,
  [SearchApi.reducerPath]: SearchApi.reducer,
  [CategoryApi.reducerPath]: CategoryApi.reducer,
  [CustomerApi.reducerPath]: CustomerApi.reducer,
  [SupplierApi.reducerPath]: SupplierApi.reducer,
  [ProductApi.reducerPath]: ProductApi.reducer,
  [BrandApi.reducerPath]: BrandApi.reducer,
  [SaleApi.reducerPath]: SaleApi.reducer,
  [SettingApi.reducerPath]: SettingApi.reducer,
  [InventoryApi.reducerPath]: InventoryApi.reducer,
  [UploadApi.reducerPath]: UploadApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      SaleApi.middleware,
      InventoryApi.middleware,
      SearchApi.middleware,
      CategoryApi.middleware,
      ProductApi.middleware,
      BrandApi.middleware,
      CustomerApi.middleware,
      SupplierApi.middleware,
      UserApi.middleware,
      SettingApi.middleware,
      UploadApi.middleware,
    ]),
});

export const persistor = persistStore(store);
export default store;
