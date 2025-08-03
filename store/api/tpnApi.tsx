import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Tpn } from "../../models/tpnModel";

import { BASE_URL } from '../../constants/baseUrl';

// console.log(BASE_URL)

export const TpnApi = createApi({
  reducerPath: "tpnApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Tpn"],
  endpoints: (builder) => ({
    Tpns: builder.query<Tpn[], void>({
      query: () => "/tpn",
      providesTags: ["Tpn"],
    }),
    Tpnwh: builder.query<Tpn[], any>({
      query: (warehouse) => `/tpn/wh/${warehouse}`,
      providesTags: ["Tpn"],
    }),
    Tpn: builder.query<Tpn, string>({
      query: (_id) => `/tpn/${_id}`,
      providesTags: ["Tpn"],
    }),
    TpnByDate: builder.query<Tpn, any>({
      query: ({ startDate, endDate, warehouse }) => `/tpn/byDate/${startDate}/${endDate}/${warehouse}`,
      providesTags: ["Tpn"],
    }),
    TpnDetails: builder.query<Tpn, any>({
      query: ({ startDate, endDate,warehouse }) => `/tpn/details/${startDate}/${endDate}/${warehouse}`,
      providesTags: ["Tpn"],
    }),
    TpnSummary: builder.query<Tpn, any>({
      query: ({ startDate, endDate,warehouse }) => `/tpn/summary/${startDate}/${endDate}/${warehouse}`,
      providesTags: ["Tpn"],
    }),
    addTpn: builder.mutation<{}, Tpn>({
      query: (Tpn) => ({
        url: "/tpn",
        method: "POST",
        body: Tpn,
      }),
      invalidatesTags: ["Tpn"],
    }),
    updateTpn: builder.mutation<void, Tpn>({
      query: ({ _id, ...rest }) => ({
        url: `/tpn/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Tpn"],
    }),
    deleteTpn: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tpn/delete/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Tpn"],
    }),
  }),
});

export const {
  useTpnsQuery,
  useTpnwhQuery,
  useTpnQuery,
  useTpnDetailsQuery,
  useTpnSummaryQuery,
  useTpnByDateQuery,
  useAddTpnMutation,
  useUpdateTpnMutation,
  useDeleteTpnMutation,
} = TpnApi;

export default TpnApi;
