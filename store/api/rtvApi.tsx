import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Rtv } from "../../models/rtvModel";

import { BASE_URL } from '../../constants/baseUrl';

// console.log(BASE_URL);

export const RtvApi = createApi({
  reducerPath: "RtvApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Rtv"],
  endpoints: (builder) => ({
    Rtves: builder.query<Rtv[], void>({
      query: () => "/Rtv",
      providesTags: ["Rtv"],
    }),
    RtvByDate: builder.query<Rtv, any>({
      query: ({ startDate, endDate,warehouse }) => `/rtv/byDate/${startDate}/${endDate}/${warehouse}`,
      providesTags: ["Rtv"],
    }),
    Rtv: builder.query<Rtv, string>({
      query: (_id) => `/Rtv/${_id}`,
      providesTags: ["Rtv"],
    }),
    RtvDetails: builder.query<Rtv, any>({
      query: ({ startDate, endDate,warehouse }) => `/rtv/details/${startDate}/${endDate}/${warehouse}`,
      providesTags: ["Rtv"],
    }),
    RtvSummary: builder.query<Rtv, any>({
      query: ({ startDate, endDate,warehouse }) => `/rtv/summary/${startDate}/${endDate}/${warehouse}`,
      providesTags: ["Rtv"],
    }),
    addRtv: builder.mutation<{}, Rtv>({
      query: (Rtv) => ({
        url: "/Rtv",
        method: "POST",
        body: Rtv,
      }),
      invalidatesTags: ["Rtv"],
    }),
    updateRtv: builder.mutation<void, Rtv>({
      query: ({ _id, ...rest }) => ({
        url: `/Rtv/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Rtv"],
    }),
    deleteRtv: builder.mutation<void, string>({
      query: (id) => ({
        url: `/Rtv/delete/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Rtv"],
    }),

    rtvCount: builder.query<Rtv[], void>({
      query: () => "/rtv/count",

      providesTags: ["Rtv"],
    }),

    rtvPagenation: builder.query<Rtv, any>({
      query: ({ page, size, q }) => `/rtv/${page}/${size}?q=${q}`,
      // query: ({page, size, q}) => `/Customer`,
      providesTags: ["Rtv"],
    }),
  }),
});

export const {
  useRtvesQuery,
  useRtvByDateQuery,
  useRtvQuery,
  useAddRtvMutation,
  useUpdateRtvMutation,
  useRtvCountQuery,
  useRtvPagenationQuery,
  useDeleteRtvMutation,
  useRtvSummaryQuery,
  useRtvDetailsQuery,
} = RtvApi;

export default RtvApi;
