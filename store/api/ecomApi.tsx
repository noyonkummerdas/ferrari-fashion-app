import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EcomSale } from "../../models/ecomSaleModel";

import { BASE_URL } from '../../constants/baseUrl';
// console.log(BASE_URL)

export const EcomSaleApi = createApi({
  reducerPath: "EcomSaleApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["EcomSale"],
  endpoints: (builder) => ({
    ecomSales: builder.query<EcomSale[], void>({
      query: () => `/ecom/sale`,
      providesTags: ["EcomSale"],
    }),
    ecomSalesByStatus: builder.query<EcomSale[], string>({
      query: (status) => `/ecom/sale/${status}`,// not found
      providesTags: ["EcomSale"],
    }),
    ecomSalesById: builder.query<EcomSale[], string>({
      query: (id) => `/ecom/sale/details/${id}`,// not found
      providesTags: ["EcomSale"],
    }),
    updateEcomSale: builder.mutation<void, EcomSale>({
      query: ({ _id, ...rest }) => ({
        url: `/ecom/sale/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["EcomSale"],
    }),
    updateEcomSaleComplete: builder.mutation<void, EcomSale>({
      query: ({ _id, ...rest }) => ({
        url: `/ecom/sale/complete/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["EcomSale"],
    }),
  }),
});
export const {
  useEcomSalesQuery,
  useEcomSalesByStatusQuery,
  useEcomSalesByIdQuery,
  useUpdateEcomSaleMutation,
  useUpdateEcomSaleCompleteMutation,
} = EcomSaleApi;

export default EcomSaleApi;
