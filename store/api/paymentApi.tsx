import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Payment } from "../../models/paymentModel";

import { BASE_URL } from '../../constants/baseUrl';

// console.log(BASE_URL);

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    Payments: builder.query<Payment[], void>({
      query: () => "/payment",
      providesTags: ["Payment"],
    }),
    Payment: builder.query<Payment, string>({
      query: (_id) => `/payment/${_id}`,
      providesTags: ["Payment"],
    }),
    paymentByCustomer: builder.query<Payment[], any>({
      query: ({ startDate, endDate, customerId }) =>
        `/payment/byCustomer/${startDate}/${endDate}/?id=${customerId}`,
      providesTags: ["Payment"],
    }),
    addPayment: builder.mutation<{}, Payment>({
      query: (Payment) => ({
        url: "/payment",
        method: "POST",
        body: Payment,
      }),
      invalidatesTags: ["Payment"],
    }),
    updatePayment: builder.mutation<void, Payment>({
      query: ({ _id, ...rest }) => ({
        url: `/payment/${_id}`, // not found
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Payment"],
    }),
    deletePayment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/payment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  usePaymentsQuery,
  usePaymentQuery,
  usePaymentByCustomerQuery,
  useAddPaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = paymentApi;

export default paymentApi;
