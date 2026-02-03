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
    Warehouse: builder.query<WarehouseTypes, any>({
      query: (_id) => `/warehouse/${_id}`,
      providesTags: (result, error, _id) => [{ type: "Warehouse", id: _id }],
    }),
    WarehouseAccounts: builder.query<WarehouseTypes, any>({
      query: ({ _id, date }) => `/warehouse/accounts/${_id}/${date}`,
      providesTags: (result, error, { _id }) => [{ type: "Warehouse", id: _id }],
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
      invalidatesTags: (result, error, { _id }) => [{ type: "Warehouse", id: _id }],
    }),
    deleteWarehouse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/warehouse/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Warehouse", id }],
    }),
  }),
});

export const {
  useWarehousesQuery,
  useWarehouseQuery,
  useWarehouseAccountsQuery,
  useAddWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
} = warehouseApi;

export default warehouseApi;
