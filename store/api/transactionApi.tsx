import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/baseUrl";
import { Transaction } from "../../types/transactions";

// console.log(BASE_URL);

export const TransactionApi = createApi({
  reducerPath: "TransactionApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Transaction"],
  endpoints: (builder) => ({
    Transactions: builder.query<Transaction[], void>({
      query: () => "/transaction",
      providesTags: ["Transaction"],
    }),
    Transaction: builder.query<Transaction, string>({
      query: (_id) => `/transaction/${_id}`,
      providesTags: ["Transaction"],
    }),
    TransactionList: builder.query<Transaction, any>({
      query: ({ warehouse, type, date }) =>
        `/transaction/list/${warehouse}/${type}/${date}`,
      providesTags: ["Transaction"],
    }),
    TransactionByCustomer: builder.query<Transaction[], any>({
      query: ({ startDate, endDate, customerId }) =>
        `/transaction/byCustomer/${startDate}/${endDate}/?id=${customerId}`,
      providesTags: ["Transaction"],
    }),
    addTransaction: builder.mutation<{}, Transaction>({
      query: (Transaction) => ({
        url: "/transaction",
        method: "POST",
        body: Transaction,
      }),
      invalidatesTags: ["Transaction"],
    }),
    updateTransaction: builder.mutation<void, Transaction>({
      query: ({ _id, ...rest }) => ({
        url: `/transaction/${_id}`, // not found
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Transaction"],
    }),
    deleteTransaction: builder.mutation<void, string>({
      query: (id) => ({
        url: `/transaction/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transaction"],
    }),
    cashInTransaction: builder.query<Transaction[], { warehouse: string; date?: string }>({
  query: ({ warehouse, date }) => `/transaction/list/${warehouse}/deposit/${date || ""}`,
  providesTags: ["Transaction"],
}),
  }),
});

export const {
  useTransactionsQuery,
  useTransactionQuery,
  useTransactionListQuery,
  useTransactionByCustomerQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useCashInTransactionQuery,
} = TransactionApi;

export default TransactionApi;
