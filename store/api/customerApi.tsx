import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Customer } from "../../models/customerModel";

import { BASE_URL } from "../../constants/baseUrl";

// console.log(BASE_URL);

export const CustomerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    Customers: builder.query<Customer[], any>({
      query: (warehouse) => `/customer/${warehouse}`,
      providesTags: ["Customer"],
    }),
    // new
    CustomerList: builder.query<Customer[], any>({
      query: ({ q }) => `/customer/search/${q}`,
      providesTags: ["Customer"],
    }),
    GetCustomerById: builder.query<Customer, any>({
      query: ({ id,date,isDate }) => `/customer/byTime/${id}/${date}/${isDate}`,
      providesTags: ["Customer"],
    }),
    GetCustomerByInvoice: builder.query<string, any>({
       query: ({invoiceId}) => `/customer/invoice/${invoiceId}`,
       keepUnusedDataFor: 0,
       refetchOnMountOrArgChange: true,
       transformResponse: (response) => {
       // return empty array or null if not found
       return response ? response : {customerId:""};
  },
     }),
    // new
    CustomersExport: builder.query<Customer[], any>({
      query: ({ warehouse }) => `/customer/export/${warehouse}`,
      providesTags: ["Customer"],
    }),
    Customer: builder.query<Customer, string>({
      query: (id) => `/customer/select/${id}`,
      providesTags: ["Customer"],
    }),

    customerCount: builder.query<Customer[], void>({
      query: () => "/customer/count",

      providesTags: ["Customer"],
    }),
    CustomerDW: builder.query<Customer[], void>({
      query: () => `/customer/dw/`,
      providesTags: ["Customer"],
    }),

    customerContact: builder.query<Customer, any>({
      query: ({ page, size, q }) => `/customer/contact/${page}/${size}?q=${q}`,
      // query: ({page, size, q}) => `/Customer`,
      providesTags: ["Customer"],
    }),
    customerPagenation: builder.query<Customer, any>({
      query: ({ page, size, warehouse, q }) =>
        `/customer/all/${page}/${size}/${warehouse}?q=${q}`,
      // query: ({page, size, q}) => `/Customer`,
      providesTags: ["Customer"],
    }),
    //new
    addCustomer: builder.mutation<{}, Customer>({
      query: (Customer) => ({
        url: "/customer/",
        method: "POST",
        body: Customer,
      }),
      invalidatesTags: ["Customer"],
    }),
    //new
    updateCustomer: builder.mutation<void, Customer>({
      query: ({ _id, ...rest }) => ({
        url: `/customer/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Customer"],
    }),
    updatePointCustomer: builder.mutation<void, Customer>({
      query: ({ _id, ...rest }) => ({
        url: `/customer/point/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Customer"],
    }),
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/customer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const {
  // new
  useCustomerListQuery,
  // new
  useCustomersQuery,
  useCustomersExportQuery,
  useCustomerQuery,
  useGetCustomerByIdQuery,
  useGetCustomerByInvoiceQuery,
  // useCustomerPointQuery,
  useCustomerDWQuery,
  useAddCustomerMutation,
  useCustomerCountQuery,
  useCustomerPagenationQuery,
  useCustomerContactQuery,
  useUpdateCustomerMutation,
  useUpdatePointCustomerMutation,
  useDeleteCustomerMutation,
} = CustomerApi;

export default CustomerApi;
