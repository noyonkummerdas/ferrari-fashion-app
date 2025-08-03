import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AccountHead } from '../../models/acheadModel';

import { BASE_URL } from '../../constants/baseUrl';

export const AccountHeadApi = createApi({
    reducerPath: "AccountHeadApi",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['AccountHead'],
    endpoints: (builder) => ({
        accountheads: builder.query<AccountHead[], void>({
            query: () => '/accounthead',
            providesTags: ['AccountHead']
        }),
        masterAccountheads: builder.query<AccountHead[], void>({
            query: () => `/accounthead/master`,
            providesTags: ['AccountHead']
        }),
        accounthead: builder.query<AccountHead, string>({
            query: (_id) => `/accounthead/${_id}`,
            providesTags: ['AccountHead']
        }),
        accountheadSub: builder.query<AccountHead, string>({
            query: (_id) => `/accounthead/sub/${_id}`,
            providesTags: ['AccountHead']
        }),
        addAccountHead: builder.mutation<{}, AccountHead>({
            query: AccountHead => ({
                url: '/accounthead',
                method: 'POST',
                body: AccountHead
            }),
            invalidatesTags: ['AccountHead']
        }),
        updateAccountHead: builder.mutation<void, AccountHead>({
            query: ({ _id, ...rest }) => ({
                url: `/accounthead/${_id}`,
                method: 'PUT',
                body: rest
            }),
            invalidatesTags: ['AccountHead']
        }),
        uploadAccountHeadPhoto: builder.mutation<any, any>({
            query: ({ _id, ...rest }) => ({
                url: `/accounthead/upload/${_id}`,
                method: 'POST',
                headers: {
                    'content-type': 'multipart/form-data',
                },
                body: rest
            }),
            invalidatesTags: ['AccountHead']
        }),
        deleteAccountHead: builder.mutation<void, string>({
            query: (id) => ({
                url: `/accounthead/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AccountHead']
        })
    })
})
export const {
    useAccountheadsQuery,
    useMasterAccountheadsQuery,
    useAccountheadQuery,
    useAccountheadSubQuery,
    useAddAccountHeadMutation,
    useUpdateAccountHeadMutation,
    useUploadAccountHeadPhotoMutation,
    useDeleteAccountHeadMutation,

} = AccountHeadApi;

export default AccountHeadApi;