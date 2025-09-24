import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


import { BASE_URL } from '../../constants/baseUrl';
import Purchase from "@/types/purchase";

// console.log(BASE_URL)

export const PurchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Purchase"],
  endpoints: (builder) => ({
    Purchases: builder.query<Purchase[], void>({
      query: () => "/purchase",
      providesTags: ["Purchase"],
    }),
    PurchasesDW: builder.query<Purchase[], any>({
      query: ({warehouse,date,isDate}) => `/purchase/list/byTime/${warehouse}/${date}/${isDate}`,
      providesTags: ["Purchase"],
    }),
    WeeklyPurchases: builder.query<Purchase[], void>({
      query: (warehouse) => `/purchase/week-purchase/${warehouse}`,
      providesTags: ["Purchase"],
    }),
    PurchaseByDate: builder.query<Purchase, any>({
      query: ({ startDate, endDate,warehouse }) =>
        `/purchase/byDate/${startDate}/${endDate}/${warehouse}`,
      providesTags: ["Purchase"],
    }),
    Purchase: builder.query<Purchase, string>({
      query: (_id) => `/purchase/${_id}`,
      providesTags: ["Purchase"],
    }),
    PurchaseSupplier: builder.query<Purchase, string>({
      query: (_id) => `/purchase/supplier/${_id}`,
      providesTags: ["Purchase"],
    }),
    PurchaseSupplierAccount: builder.query<Purchase, string>({
      query: (_id) => `/purchase/supplier/account/${_id}`,
      providesTags: ["Purchase"],
    }),

    addPurchase: builder.mutation<any, Purchase>({
      query: (Purchase) => ({
        url: "/purchase",
        method: "POST",
        body: Purchase,
      }),
      invalidatesTags: ["Purchase"],
    }),
    updatePurchase: builder.mutation<void, Purchase>({
      query: ({ _id, ...rest }) => ({
        url: `/purchase/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Purchase"],
    }),
    updatePurchaseP: builder.mutation<void, Purchase>({
      query: ({ _id, ...rest }) => ({
        url: `/purchase/update/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Purchase"],
    }),
    updatePurchaseStatus: builder.mutation<void, Purchase>({
      query: ({ poNo, ...rest }) => ({
        url: `/purchase/status/${poNo}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Purchase"],
    }),
    deletePurchase: builder.mutation<void, string>({
      query: (id) => ({
        url: `/purchase/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Purchase"],
    }),
  }),
});

export const {
  usePurchasesQuery,
  usePurchaseByDateQuery,
  useWeeklyPurchasesQuery,
  usePurchaseQuery,
  usePurchaseSupplierQuery,
  usePurchaseSupplierAccountQuery,
  useAddPurchaseMutation,
  useUpdatePurchaseMutation,
  useUpdatePurchasePMutation,
  useUpdatePurchaseStatusMutation,
  useDeletePurchaseMutation,
  usePurchasesDWQuery,
} = PurchaseApi;

export default PurchaseApi;
