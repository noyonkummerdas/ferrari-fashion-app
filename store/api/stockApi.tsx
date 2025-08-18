import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Stock } from "../../types/stock";

import { BASE_URL } from "../../constants/baseUrl";

// console.log(BASE_URL);

export const stockApi = createApi({
  reducerPath: "stockApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Stock"],
  endpoints: (builder) => ({
    // new
    Stocks: builder.query<Stock[], any>({
      query: ({ q }) => `/stock/search/${q}`,
      providesTags: ["Stock"],
    }),
    Stock: builder.query<string, Stock>({
      query: ({ _id }) => `/stock/${_id}`,
      providesTags: ["Stock"],
    }),
    addStock: builder.mutation<{}, Stock>({
      query: (Stock) => ({
        url: "/stock",
        method: "POST",
        body: Stock,
      }),
      invalidatesTags: ["Stock"],
    }),
    updateStock: builder.mutation<{}, Stock>({
      query: ({ _id, ...rest }) => ({
        url: `/Stock/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Stock"],
    }),

    deleteStock: builder.mutation<void, string>({
      query: (id) => ({
        url: `/Stock/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Stock"],
    }),
  }),
});

export const {
  useStocksQuery,
  useStockQuery,
  useAddStockMutation,
  useUpdateStockMutation,
  useDeleteStockMutation,
} = stockApi;

export default stockApi;
