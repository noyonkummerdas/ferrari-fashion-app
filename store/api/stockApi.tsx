import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/baseUrl";

import { Stock } from "../../types/stock";

// console.log("STOCK API", BASE_URL);

export const StockApi = createApi({
  reducerPath: "StockApi",
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
    addStock: builder.mutation({
      query: (stockData) => ({
        url: "/stock",
        method: "POST",
        body: stockData,
      }),
    }),
    updateStock: builder.mutation<{}, Stock>({
      query: ({ _id, ...rest }) => ({
        url: `/stock/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Stock"],
    }),

    deleteStock: builder.mutation<void, string>({
      query: (id) => ({
        url: `/stock/${id}`,
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
} = StockApi;

export default StockApi;
