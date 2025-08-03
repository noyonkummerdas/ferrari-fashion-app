import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Sale } from "../../models/saleModel";

import { BASE_URL } from '../../constants/baseUrl';

// console.log(BASE_URL)

export const SaleApi = createApi({
  reducerPath: "SaleApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Sale"],
  endpoints: (builder) => ({
    // Sales: builder.query<Sale[], void>({
    //   query: () => `/sale/`,
    //   providesTags: ["Sale"],
    // }),
    // SalesPointSpent: builder.query<Sale[], any>({
    //   query: ({ startDate, endDate }) =>
    //     `/sale/todayPoint/${startDate}/${endDate}`,
    //   providesTags: ["Sale"],
    // }),
    // SalesWeekly: builder.query<Sale[], any>({
    //   query: ({warehouse,aamarId }) => `/sale/week-sale/${warehouse}/${aamarId}`,
    //   providesTags: ["Sale"],
    // }),

    //new
    chartSale: builder.query<Sale[], any>({
      query: ({warehouse,aamarId }) => `/mobileApp/chartSale/${warehouse}/${aamarId}`,
      providesTags: ["Sale"],
    }),
    latestSale: builder.query<Sale[], any>({
      query: ({warehouse,aamarId, limit }) => `/mobileApp/today-latest/${warehouse}/${aamarId}/${limit}`,
      providesTags: ["Sale"],
    }),
    dashboardSale: builder.query<Sale[], any>({
      query: ({ startDate, endDate,warehouse,aamarId }) =>
        `/sale/dashboardSale/${startDate}/${endDate}/${warehouse}/${aamarId}`,
      providesTags: ["Sale"],
    }),
    allSale: builder.query<Sale[], any>({
      query: ({ startDate, endDate,warehouse,aamarId }) =>
        `/mobileApp/by-Date/${startDate}/${endDate}/${warehouse}/${aamarId}`,
      providesTags: ["Sale"],
    }),
    Sale: builder.query<Sale, string>({
      query: (_id) => `/mobileApp/${_id}`,
      providesTags: ["Sale"],
    }),
    addSale: builder.mutation<{}, Sale>({
      query: (Sale) => ({
        url: "/mobileApp/sale/create",
        method: "POST",
        body: Sale,
      }),
      invalidatesTags: ["Sale"],
    }),
    //new-end

    
    // SaleByInvoice: builder.query<Sale, string>({
    //   query: (invoiceId) => `/sale/invoice/${invoiceId}`,
    //   providesTags: ["Sale"],
    // }),
    // SaleByDate: builder.query<Sale[], any>({
    //   query: ({ startDate, endDate,warehouse }) => `/sale/byDate/${startDate}/${endDate}/${warehouse}`,
    //   providesTags: ["Sale"],
    // }),
    // dueSale: builder.query<Sale[], any>({
    //   query: ({warehouse}) => `/sale/dueSale/${warehouse}`,
    //   providesTags: ["Sale"],
    // }),
    // SaleByDateAfterSale: builder.query<Sale[], any>({
    //   query: ({ startDate, endDate, supplier }) =>
    //     `/sale/aftersale/${startDate}/${endDate}/${supplier}`,
    //   providesTags: ["Sale"],
    // }),
    // SaleTotal: builder.query<Sale[], any>({
    //   query: ({ startDate, endDate }) => `/sale/total/${startDate}/${endDate}`, // not found
    //   providesTags: ["Sale"],
    // }),
    
    // SaleFootfall: builder.query<Sale[], any>({
    //   query: ({ startDate, endDate }) =>
    //     `/sale/footfall/${startDate}/${endDate}`,
    //   providesTags: ["Sale"],
    // }),
    // SaleExportByDate: builder.query<Sale[], any>({
    //   query: ({ startDate, endDate }) => `/sale/export/${startDate}/${endDate}`,
    //   providesTags: ["Sale"],
    // }),
    // SaleExportByDateAndCat: builder.query<Sale[], any>({
    //   query: ({ startDate, endDate,warehouse, cat }) =>
    //     `/sale/byCategory/${startDate}/${endDate}/${warehouse}/${cat}`,
    //   providesTags: ["Sale"],
    // }),
    // SaleExportByDateAndSupplier: builder.query<Sale[], any>({
    //   query: ({ startDate, endDate, supplier }) =>
    //     `/sale/bySupplier/${startDate}/${endDate}/${supplier}`,
    //   providesTags: ["Sale"],
    // }),
    // SaleByBiller: builder.query<Sale[], any>({
    //   query: ({ startDate, endDate, biller }) =>
    //     `/sale/posSale/${startDate}/${endDate}/${biller}`,
    //   providesTags: ["Sale"],
    // }),
    // DelSaleExportByDate: builder.query<Sale[], any>({
    //   query: ({ startDate, endDate }) =>
    //     `/sale/exportDel/${startDate}/${endDate}`,
    //   providesTags: ["Sale"],
    // }),

    // CustomerPurchaseHistory: builder.query<Sale[], any>({
    //   query: ({ start, end,id }) =>
    //     `/sale/customerHistory/${start}/${end}/${id}`,
    //   providesTags: ["Sale"],
    // }),
    // GetCustomerById: builder.query<Sale[], any>({
    //   query: ({ id }) =>
    //     `/sale/getCustomerById/${id}`,
    //   providesTags: ["Sale"],
    // }),
    // SaleArticelExportByDate: builder.query<Sale[], any>({
    //   query: ({ startDate, endDate,warehouse, q }) =>
    //     `/sale/exportArticale/${startDate}/${endDate}/${warehouse}?q=${q}`,
    //   providesTags: ["Sale"],
    // }),
    // SaleCategoryByDate: builder.query<Sale[], any>({
    //   query: ({ startDate, endDate,warehouse }) =>
    //     `/sale/category/${startDate}/${endDate}/${warehouse}`,
    //   providesTags: ["Sale"],
    // }),

    // addSale: builder.mutation<{}, Sale>({
    //   query: (Sale) => ({
    //     url: "/sale",
    //     method: "POST",
    //     body: Sale,
    //   }),
    //   invalidatesTags: ["Sale"],
    // }),
    // updateSale: builder.mutation<void, Sale>({
    //   query: ({ _id, ...rest }) => ({
    //     url: `/sale/${_id}`,
    //     method: "PUT",
    //     body: rest,
    //   }),
    //   invalidatesTags: ["Sale"],
    // }),
    // deleteSale: builder.mutation<void, string>({
    //     query: (id) => ({
    //         url: `/sale/${ id }`,
    //         method: 'DELETE',
    //     }),
    //     invalidatesTags: ['Sale']
    // }),
    // deleteTempSale: builder.mutation<void, Sale>({
    //   query: ({ _id, ...rest }) => ({
    //     url: `/sale/${_id}`,
    //     method: "PUT",
    //     body: rest,
    //   }),
    //   invalidatesTags: ["Sale"],
    // }),
  }),
});

export const {
  // useSalesQuery,
  // useSalesPointSpentQuery,
  // useSalesWeeklyQuery,
  useAllSaleQuery,
  useChartSaleQuery,
  useLatestSaleQuery,
  useSaleQuery,
  useDashboardSaleQuery,
  useAddSaleMutation,
  // useSaleByDateQuery,
  // useGetCustomerByIdQuery,
  // useSaleByDateAfterSaleQuery,
  // useSaleTotalQuery,
  // useDueSaleQuery,
  // useSaleFootfallQuery,
  // useSaleByInvoiceQuery,
  // useSaleExportByDateQuery,
  // useSaleExportByDateAndCatQuery,
  // useSaleExportByDateAndSupplierQuery,
  // useSaleByBillerQuery,
  // useDelSaleExportByDateQuery,
  // useSaleArticelExportByDateQuery,
  // useSaleCategoryByDateQuery,
  // useDeleteTempSaleMutation,
  // useUpdateSaleMutation,
  // useDeleteSaleMutation,
  // useCustomerPurchaseHistoryQuery,
} = SaleApi;

export default SaleApi;
