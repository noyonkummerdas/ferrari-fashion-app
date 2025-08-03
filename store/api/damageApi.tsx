import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Damage } from "../../models/damageModel";

import { BASE_URL } from '../../constants/baseUrl';

// console.log(BASE_URL);

export const DamageApi = createApi({
  reducerPath: "damageApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Damage"],
  endpoints: (builder) => ({
    Damages: builder.query<Damage[], void>({
      query: () => "/damage",
      providesTags: ["Damage"],
    }),
    TodayDamages: builder.query<Damage[], void>({
      query: () => "/damage/today-damage",
      providesTags: ["Damage"],
    }),
    DamagesExport: builder.query<Damage[], any>({
      query: ({warehouse}) => `/damage/export/${warehouse}`,
      providesTags: ["Damage"],
    }),
    DamageByDate: builder.query<Damage, any>({
      query: ({ startDate, endDate,warehouse }) =>
        `/damage/byDate/${startDate}/${endDate}/${warehouse}`,
      providesTags: ["Damage"],
    }),
    Damage: builder.query<Damage, string>({
      query: (_id) => `/damage/${_id}`,
      providesTags: ["Damage"],
    }),
    damageDetails: builder.query<Damage, any>({
      query: ({ startDate, endDate,warehouse }) =>
        `/damage/details/${startDate}/${endDate}/${warehouse}`,
      providesTags: ["Damage"],
    }),
    damageSummary: builder.query<Damage, any>({
      query: ({ startDate, endDate,warehouse }) =>
        `/damage/summary/${startDate}/${endDate}/${warehouse}`,
      providesTags: ["Damage"],
    }),
    addDamage: builder.mutation<{}, Damage>({
      query: (Damage) => ({
        url: "/damage",
        method: "POST",
        body: Damage,
      }),
      invalidatesTags: ["Damage"],
    }),
    updateDamage: builder.mutation<void, Damage>({
      query: ({ _id, ...rest }) => ({
        url: `/damage/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Damage"],
    }),
    deleteDamage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/damage/delete/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Damage"],
    }),
  }),
});

export const {
  useDamagesQuery,
  useTodayDamagesQuery,
  useDamageByDateQuery,
  useDamagesExportQuery,
  useDamageQuery,
  useAddDamageMutation,
  useUpdateDamageMutation,
  useDeleteDamageMutation,
  useDamageDetailsQuery,
  useDamageSummaryQuery,
} = DamageApi;

export default DamageApi;
