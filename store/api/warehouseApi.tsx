import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Warehouse } from "../../models/warehouseModel";

import { BASE_URL } from '../../constants/baseUrl';

// console.log(BASE_URL);

export const warehouseApi = createApi({
  reducerPath: "warehouseApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Warehouse"],
  endpoints: (builder) => ({
    Warehouses: builder.query<Warehouse[], void>({
      query: () => "/warehouse",
      providesTags: ["Warehouse"],
    }),
    Warehouse: builder.query<Warehouse, string>({
      query: (_id) => `/warehouse/${_id}`,
      providesTags: ["Warehouse"],
    }),
    // masterDamage: builder.query<Warehouse[], void>({
    //     query: (_id) => `/damage/master`,
    //     providesTags: ['Warehouse']
    // }),
    addWarehouse: builder.mutation<{}, Warehouse>({
      query: (Warehouse) => ({
        url: "/warehouse",
        method: "POST",
        body: Warehouse,
      }),
      invalidatesTags: ["Warehouse"],
    }),
    updateWarehouse: builder.mutation<void, Warehouse>({
      query: ({ _id, ...rest }) => ({
        url: `/warehouse/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Warehouse"],
    }),
    deleteWarehouse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/warehouse/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Warehouse"],
    }),
  }),
});

export const {
  useWarehousesQuery,
  useWarehouseQuery,
  useAddWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
} = warehouseApi;

export default warehouseApi;
