import { Supplier } from "@/types/supplier";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../../constants/baseUrl";

// console.log(BASE_URL);

export const SupplierApi = createApi({
  reducerPath: "SupplierApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Supplier"],
  endpoints: (builder) => ({
    // new
    Suppliers: builder.query<Supplier[], any>({
      query: ({ q }) => `/supplier/search/${q}`,
      providesTags: ["Supplier"],
    }),
    Supplier: builder.query<any, { _id: string; date: string; isDate: string }>({
      query: ({ _id, date, isDate }) => `/supplier/byTime/${_id}/${date}/${isDate}`,
      providesTags: ["Supplier"],
    }),
    GetSupplierByInvoice: builder.query<string, any>({
           query: ({invoiceId}) => `/supplier/invoice/${invoiceId}`,
            keepUnusedDataFor: 0,
       refetchOnMountOrArgChange: true,
       transformResponse: (response) => {
       // return empty array or null if not found
       return response ? response : {supplierId:""};
  },
         }),
    addSupplier: builder.mutation<{}, Supplier>({
      query: (supplier) => ({
        url: "/supplier",
        method: "POST",
        body: supplier,
      }),
      invalidatesTags: ["Supplier"],
    }),
    updateSupplier: builder.mutation<{}, Supplier>({
      query: ({ _id, ...rest }) => ({
        url: `/supplier/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Supplier"],
    }),
    //new
    SupplierExport: builder.query<Supplier[], void>({
      query: () => "/supplier/export",
      providesTags: ["Supplier"],
    }),

    SupplierTest: builder.query<Supplier, string>({
      query: (_id) => `/supplier/test/${_id}`,
      providesTags: ["Supplier"],
    }),
    SupplierPurchase: builder.query<Supplier, string>({
      query: (_id) => `/supplier/purchase/${_id}`,
      providesTags: ["Supplier"],
    }),
    SupplierByProduct: builder.query<Supplier, string>({
      query: (code) => `/supplier/product/${code}`,
      providesTags: ["Supplier"],
    }),

    countSupplier: builder.query<Supplier[], void>({
      query: () => "/supplier/count",
      providesTags: ["Supplier"],
    }),

    supplierPagenation: builder.query<Supplier, any>({
      query: ({ page, size, warehouse, q }) =>
        `/supplier/${page}/${size}?q=${q}`, // not found
      // query: ({page, size, q}) => `/Customer`,
      providesTags: ["Supplier"],
    }),

    supplierLedger: builder.query<Supplier, any>({
      query: (_id) => `/supplier/ledger/${_id}`,
      providesTags: ["Supplier"],
    }),
    supplierLedgerByDate: builder.query<
      any,
      { id: string; start: string; end: string }
    >({
      query: ({ id, start, end }) =>
        `/supplier/ledgerByDate/${id}/${start}/${end}`,
      providesTags: ["Supplier"],
    }),

    deleteSupplier: builder.mutation<void, string>({
      query: (id) => ({
        url: `/supplier/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Supplier"],
    }),
  }),
});

export const {
  useSuppliersQuery,
  useSupplierQuery,
  useSupplierTestQuery,
  useGetSupplierByInvoiceQuery,
  useSupplierPurchaseQuery,
  useSupplierExportQuery,
  useSupplierByProductQuery,
  useSupplierPagenationQuery,
  useSupplierLedgerQuery,
  useSupplierLedgerByDateQuery,
  useCountSupplierQuery,
  useAddSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = SupplierApi;

export default SupplierApi;
