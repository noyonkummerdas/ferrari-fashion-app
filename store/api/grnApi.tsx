import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Grn } from "../../models/grnModel";

import { BASE_URL } from '../../constants/baseUrl';

// console.log(BASE_URL)

export const GrnApi = createApi({
  reducerPath: "GrnApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Grn"],
  endpoints: (builder) => ({
    Grns: builder.query<Grn[], void>({
      query: () => "/grn",
      providesTags: ["Grn"],
    }),
    WeeklyGrns: builder.query<Grn[], void>({
      query: () => "/grn/week-grn",
      providesTags: ["Grn"],
    }),
    TodayGrns: builder.query<Grn[], void>({
      query: () => "/grn/today-grn",
      providesTags: ["Grn"],
    }),
    GrnByDate: builder.query<Grn, any>({
      query: ({ startDate, endDate, warehouse }) => `/grn/byDate/${startDate}/${endDate}/${warehouse}`,
      providesTags: ["Grn"],
    }),
    GrnDetails: builder.query<Grn, any>({
      query: ({ startDate, endDate,warehouse }) => `/grn/details/${startDate}/${endDate}/${warehouse}`,
      providesTags: ["Grn"],
    }),
    GRNSummary: builder.query<Grn, any>({
      query: ({ startDate, endDate,warehouse }) => `/grn/summary/${startDate}/${endDate}/${warehouse}`,
      providesTags: ["Grn"],
    }),
    GrnArticleWise: builder.query<Grn, any>({
      query: ({ startDate, endDate,warehouse,q }) => `/grn/article/${startDate}/${endDate}/${warehouse}?q=${q}`,
      providesTags: ["Grn"],
    }),
    Grn: builder.query<Grn, string>({
      query: (_id) => `/grn/${_id}`,
      providesTags: ["Grn"],
    }),
    GrnBySupplier: builder.query<Grn, string>({
      query: (_id) => `/grn/supplier/account/${_id}`,
      providesTags: ["Grn"],
    }),

    grnPagenation: builder.query<Grn, any>({
      query: ({ page, size, q }) => `/grn/${page}/${size}?q=${q}`,
      // query: ({page, size, q}) => `/Customer`,
      providesTags: ["Grn"],
    }),
    grnArticleWise: builder.query<Grn, any>({
      query: ({ startDate, endDate,warehouse, q }) => `/grn/article/${startDate}/${endDate}/${warehouse}?q=${q}`,
      providesTags: ["Grn"],
    }),

    addGrn: builder.mutation<{}, Grn>({
      query: (Grn) => ({
        url: "/grn",
        method: "POST",
        body: Grn,
      }),
      invalidatesTags: ["Grn"],
    }),
    updateGrn: builder.mutation<void, Grn>({
      query: ({ _id, ...rest }) => ({
        url: `/grn/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Grn"],
    }),

    grnCount: builder.query<Grn[], void>({
      query: () => "/grn/count",

      providesTags: ["Grn"],
    }),
    deleteGrn: builder.mutation<void, Grn>({
      query: ({ _id, ...rest }) => ({
        url: `/grn/delete/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Grn"],
    }),
  }),
});

export const {
  useGrnsQuery,
  useWeeklyGrnsQuery,
  useTodayGrnsQuery,
  useGrnByDateQuery,
  useGrnQuery,
  useGrnBySupplierQuery,
  useAddGrnMutation,
  useUpdateGrnMutation,
  useGrnCountQuery,
  useGrnPagenationQuery,
  useDeleteGrnMutation,
  useGrnDetailsQuery,
  useGRNSummaryQuery,
  useGrnArticleWiseQuery,
} = GrnApi;

export default GrnApi;
