import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/baseUrl";

const DashbordApi = createApi({
  reducerPath: "DashbordApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Dashbord"],
  endpoints: (builder) => ({
    dashbord: builder.query<any , any>({
      query: ({date,warehouse}) => `/dashboard/byDate/${warehouse}/${date}`,
    }),
  }),
});

export const { useDashbordQuery } = DashbordApi;

export default DashbordApi;