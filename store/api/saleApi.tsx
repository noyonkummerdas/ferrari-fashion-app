import { Sale } from "@/types/sale";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from '../../constants/baseUrl';

export const SaleApi = createApi({
  reducerPath: "SaleApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Sale"],
  endpoints: (builder) => ({
    // Fetch all sales by date range
    allSale: builder.query<Sale[], { startDate: string; endDate: string; warehouse: string; aamarId: string }>({
      query: ({ startDate, warehouse }) =>
        `/sale/list/${warehouse}/${startDate}`,
      providesTags: ["Sale"],
    }),

    // Fetch single sale by ID
    sale: builder.query<Sale, string>({
      query: (id) => `/sale/${id}`,
      providesTags: ["Sale"],
    }),

    // Add new sale
    addSale: builder.mutation<void, Sale>({
      query: (sale) => ({
        url: "/sale",
        method: "POST",
        body: sale,
      }),
      invalidatesTags: ["Sale"],
    }),
  }),
});

export const {
  useAllSaleQuery,
  useSaleQuery,
  useAddSaleMutation,
} = SaleApi;

export default SaleApi;
