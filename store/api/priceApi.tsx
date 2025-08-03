import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Price } from "../../models/priceModel";

import { BASE_URL } from '../../constants/baseUrl';

// console.log(BASE_URL);

export const PriceApi = createApi({
  reducerPath: "priceApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Price"],
  endpoints: (builder) => ({
    Prices: builder.query<Price[], void>({
      query: () => "/price",
      providesTags: ["Price"],
    }),
    PricesExport: builder.query<Price[], void>({
      query: () => "/price/export",
      providesTags: ["Price"],
    }),
    Price: builder.query<Price, string>({
      query: (_id) => `/price/${_id}`,
      providesTags: ["Price"],
    }),
    PriceByProduct: builder.query<Price, string>({
      query: (_id) => `/price/product/${_id}`,
      providesTags: ["Price"],
    }),
    PriceByProductSwitch: builder.query<Price, string>({
      query: (_id) => `/price/productswitch/${_id}`,
      providesTags: ["Price"],
    }),
    addPrice: builder.mutation<{}, Price>({
      query: (Price) => ({
        url: "/price",
        method: "POST",
        body: Price,
      }),
      // TODO:: GET RESPONSE
      invalidatesTags: ["Price"],
    }),
    asyncPrice: builder.mutation<{}, Price>({
      query: (productId) => ({
        url: "/price/syncPrice",
        method: "POST",
        body: productId,
      }),
      invalidatesTags: ["Price"],
    }),
    addPriceMulti: builder.mutation<{}, Price>({
      query: (Price) => ({
        url: "/price/multiprice",
        method: "PUT",
        body: Price,
      }),
      // TODO:: GET RESPONSE
      invalidatesTags: ["Price"],
    }),
    updatePrice: builder.mutation<void, Price>({
      query: ({ _id, ...rest }) => ({
        url: `/price/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Price"],
    }),
    updateEditPrice: builder.mutation<void, Price>({
      query: ({ _id, ...rest }) => ({
        url: `/price/edit/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Price"],
    }),
    createInventory: builder.mutation<void, Price>({
      query: (data) => ({
        url: `/price/createInventory`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Price"],
    }),
    deletePrice: builder.mutation<void, string>({
      query: (id) => ({
        url: `/price/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Price"],
    }),
  }),
});

export const {
  usePricesQuery,
  usePricesExportQuery,
  usePriceQuery,
  usePriceByProductQuery,
  usePriceByProductSwitchQuery,
  useAddPriceMutation,
  useUpdatePriceMutation,
  useUpdateEditPriceMutation,
  useDeletePriceMutation,
  useCreateInventoryMutation,
  useAsyncPriceMutation,
} = PriceApi;

export default PriceApi;
