import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Adjust } from "../../models/adjustModel";

import { BASE_URL } from '../../constants/baseUrl';

// console.log(BASE_URL);

export const AdjustApi = createApi({
  reducerPath: "adjustApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Adjust"],
  endpoints: (builder) => ({
    Adjusts: builder.query<Adjust[], void>({
      query: () => "/adjust",
      providesTags: ["Adjust"],
    }),
    TodayAdjusts: builder.query<Adjust[], void>({
      query: () => "/adjust/today-adjust",
      providesTags: ["Adjust"],
    }),
    AdjustsExport: builder.query<Adjust[], void>({
      query: () => "/adjust/export",
      providesTags: ["Adjust"],
    }),
    AdjustByDate: builder.query<Adjust, any>({
      query: ({ startDate, endDate }) =>
        `/adjust/byDate/${startDate}/${endDate}`,
      providesTags: ["Adjust"],
    }),
    Adjust: builder.query<Adjust, string>({
      query: (_id) => `/adjust/${_id}`,
      providesTags: ["Adjust"],
    }),

    addAdjust: builder.mutation<{}, Adjust>({
      query: (Adjust) => ({
        url: "/adjust",
        method: "POST",
        body: Adjust,
      }),
      invalidatesTags: ["Adjust"],
    }),
    updateAdjust: builder.mutation<void, Adjust>({
      query: ({ _id, ...rest }) => ({
        url: `/adjust/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Adjust"],
    }),
    deleteAdjust: builder.mutation<void, string>({
      query: (id) => ({
        url: `/adjust/delete/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Adjust"],
    }),
  }),
});

export const {
  useAdjustsQuery,
  useTodayAdjustsQuery,
  useAdjustByDateQuery,
  useAdjustsExportQuery,
  useAdjustQuery,
  useAddAdjustMutation,
  useUpdateAdjustMutation,
  useDeleteAdjustMutation,
} = AdjustApi;

export default AdjustApi;
