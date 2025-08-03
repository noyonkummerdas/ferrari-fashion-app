import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Account } from "../../models/accountModel";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

export const AccountApi = createApi({
  reducerPath: "AccountApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Account"],
  endpoints: (builder) => ({
    accounts: builder.query<Account[], void>({
      query: () => "/account",
      providesTags: ["Account"],
    }),
    accountByDate: builder.query<Account, any>({
      query: ({ startDate, endDate }) =>
        `/account/byDate/${startDate}/${endDate}`,
      providesTags: ["Account"],
    }),
    account: builder.query<Account, string>({
      query: (_id) => `/account/${_id}`,
      providesTags: ["Account"],
    }),
    addAccount: builder.mutation<{}, Account>({
      query: (Account) => ({
        url: "/account",
        method: "POST",
        body: Account,
      }),
      invalidatesTags: ["Account"],
    }),
    updateAccount: builder.mutation<void, Account>({
      query: ({ _id, ...rest }) => ({
        url: `/account/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Account"],
    }),
    updateAccountDelete: builder.mutation<void, Account>({
      query: ({ _id, ...rest }) => ({
        url: `/account/delete/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Account"],
    }),
    deleteAccount: builder.mutation<void, string>({
      query: (id) => ({
        url: `/account/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Account"],
    }),
  }),
});
export const {
  useAccountsQuery,
  useAccountByDateQuery,
  useAccountQuery,
  useAddAccountMutation,
  useUpdateAccountMutation,
  useUpdateAccountDeleteMutation,
  useDeleteAccountMutation,
} = AccountApi;
export default AccountApi;
