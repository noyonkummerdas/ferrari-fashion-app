import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { WarehouseTypes } from "@/types/warehouse";
import { BASE_URL } from "../../constants/baseUrl";

// console.log(BASE_URL);

export const warehouseApi = createApi({
  reducerPath: "warehouseApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Warehouse"],
  endpoints: (builder) => ({
    Warehouses: builder.query<WarehouseTypes[], void>({
      query: () => "/warehouse",
      providesTags: ["Warehouse"],
    }),
    Warehouse: builder.query<WarehouseTypes, string>({
      query: (_id) => `/warehouse/${_id}`,
      providesTags: ["Warehouse"],
    }),
    addWarehouse: builder.mutation<{}, WarehouseTypes>({
      query: (Warehouse) => ({
        url: "/warehouse",
        method: "POST",
        body: Warehouse,
      }),
      invalidatesTags: ["Warehouse"],
    }),
    updateWarehouse: builder.mutation<void, WarehouseTypes>({
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
