import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Brand } from "../../models/brandModel";

import { BASE_URL } from '../../constants/baseUrl';

// console.log(BASE_URL);

export const BrandApi = createApi({
  reducerPath: "BrandApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    // new
    brands: builder.query<Brand[], any>({
      query: ({ limit,aamarId,q }) => `/mobileApp/brand/all/${limit}/${aamarId}/${q}`,
      providesTags: ["Brand"],
    }),
    // new
    brand: builder.query<Brand, string>({
      query: ({_id}) => `/brand/${_id}`,
      providesTags: ["Brand"],
    }),
    addBrand: builder.mutation<{}, Brand>({
      query: (Brand) => ({
        url: "/brand",
        method: "POST",
        body: Brand,
      }),
      invalidatesTags: ["Brand"],
    }),
    updateBrand: builder.mutation<void, Brand>({
      query: ({ _id, ...rest }) => ({
        url: `/brand/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Brand"],
    }),
    deleteBrand: builder.mutation<void, string>({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  // new
  useBrandsQuery,
  // new
  useBrandQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = BrandApi;

export default BrandApi;
