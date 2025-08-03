import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PosCollection } from "../../models/posCollectionModel";

import { BASE_URL } from '../../constants/baseUrl';

// console.log(BASE_URL);

export const PosCollectionApi = createApi({
  reducerPath: "posCollectionApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["PosCollection"],
  endpoints: (builder) => ({
    DayBooks: builder.query<PosCollection[], any>({
      query: ({date,warehouse}) => `/daybook/byDate/${date}/${warehouse}`,
      providesTags: ["PosCollection"],
    }),
    DayBook: builder.query<PosCollection, string>({
      query: (_id) => `/daybook/${_id}`,
      providesTags: ["PosCollection"],
    }),
    DayBookByCustomer: builder.query<PosCollection[], any>({
      query: ({ startDate, endDate, customerId }) =>
        `/daybook/byCustomer/${startDate}/${endDate}/?id=${customerId}`,
      providesTags: ["PosCollection"],
    }),
    addDayBook: builder.mutation<{}, PosCollection>({
      query: (DayBook) => ({
        url: "/daybook",
        method: "POST",
        body: DayBook,
      }),
      invalidatesTags: ["PosCollection"],
    }),
    updateDayBook: builder.mutation<void, PosCollection>({
      query: ({ _id, ...rest }) => ({
        url: `/daybook/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["PosCollection"],
    }),
    deleteDayBook: builder.mutation<void, string>({
      query: (id) => ({
        url: `/daybook/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PosCollection"],
    }),
  }),
});

export const {
  useDayBooksQuery,
  useDayBookQuery,
  useDayBookByCustomerQuery,
  useAddDayBookMutation,
  useUpdateDayBookMutation,
  useDeleteDayBookMutation,
} = PosCollectionApi;

export default PosCollectionApi;
