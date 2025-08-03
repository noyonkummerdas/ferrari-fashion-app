import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Unit } from "../../models/unitModel";

import { BASE_URL } from '../../constants/baseUrl';

// console.log(BASE_URL);

export const UnitApi = createApi({
  reducerPath: "UnitApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Unit"],
  endpoints: (builder) => ({
    Units: builder.query<Unit[], void>({
      query: () => "/unit",
      providesTags: ["Unit"],
    }),
    Unit: builder.query<Unit, string>({
      query: (_id) => `/unit/${_id}`,
      providesTags: ["Unit"],
    }),

    addUnit: builder.mutation<{}, Unit>({
      query: (Damage) => ({
        url: "/unit",
        method: "POST",
        body: Damage,
      }),
      invalidatesTags: ["Unit"],
    }),
    updateUnit: builder.mutation<void, Unit>({
      query: ({ _id, ...rest }) => ({
        url: `/unit/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Unit"],
    }),
    deleteUnit: builder.mutation<void, string>({
      query: (id) => ({
        url: `/unit/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Unit"],
    }),
  }),
});

export const {
  useUnitsQuery,
  useUnitQuery,
  useAddUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = UnitApi;

export default UnitApi;
