**Supplier and Customer Flow Report

**Overview**
- **Scope:** Supplier and Customer UI flows, data interactions, API endpoints, navigation, and recommendations.
- **Files reviewed:** [app/supplier/add-supplier.tsx](app/supplier/add-supplier.tsx), [app/supplier/[id].tsx](app/supplier/[id].tsx), [app/supplier/details/[id].tsx](app/supplier/details/[id].tsx), [app/customer/add-customer.tsx](app/customer/add-customer.tsx), [app/customer/[id].tsx](app/customer/[id].tsx), [app/(drawer)/(tabs)/(connects)/customers.tsx](app/(drawer)/(tabs)/(connects)/customers.tsx), [store/api/supplierApi.tsx](store/api/supplierApi.tsx), [store/api/customerApi.tsx](store/api/customerApi.tsx)

**Supplier Flow**
- **Screens:**
  - **Add Supplier:** [app/supplier/add-supplier.tsx](app/supplier/add-supplier.tsx) — form fields: `name`, `phone`, `email`, `company`, `address`, `balance`, `status`, `warehouse`, optional `photo` upload. Submits via `useAddSupplierMutation`.
  - **Update Supplier:** [app/supplier/[id].tsx](app/supplier/[id].tsx) — loads supplier via `useSupplierQuery`, pre-fills form, updates via `useUpdateSupplierMutation`.
  - **Supplier Details:** [app/supplier/details/[id].tsx](app/supplier/details/[id].tsx) — (currently commented) shows supplier info, transactions, month selector, ledger and balances.

- **API Interactions (store/api/supplierApi.tsx):**
  - Search/list: `/supplier/search/{q}` — `useSuppliersQuery` / `useSupplierListQuery` style.
  - Get single: `/supplier/{_id}` and `/supplier/byTime/{_id}/{date}/{isDate}` — `useSupplierByIdQuery`, `useSupplierQuery`.
  - Add: `POST /supplier` — `useAddSupplierMutation`.
  - Update: `PUT /supplier/{_id}` — `useUpdateSupplierMutation`.
  - Delete: `DELETE /supplier/{id}` — `useDeleteSupplierMutation`.
  - Ledger, export, count, purchase-related endpoints also available (`/supplier/ledger/{id}`, `/supplier/export`, `/supplier/count`, etc.).

- **Data Flow & Notes:**
  - Forms set `warehouse` from `userInfo` (via `useGlobalContext`).
  - Photo uses `expo-image-picker` and stores `photo` URI in form; server-side handling expected.
  - After mutation success, UI uses `router.back()` to return; mutations invalidate `Supplier` tag to refresh lists.
  - Supplier details file includes date-based ledger fetching and transaction aggregation (commented-out implementation present).

**Customer Flow**
- **Screens:**
  - **Add Customer:** [app/customer/add-customer.tsx](app/customer/add-customer.tsx) — fields: `name`, `phone`, `email`, `company`, `address`, `balance`, `status`, `warehouse`, `photo`. Validates required fields and calls `useAddCustomerMutation`.
  - **Update Customer:** [app/customer/[id].tsx](app/customer/[id].tsx) — fetches customer with `useGetCustomerByIdQuery`, pre-fills form, updates via `useUpdateCustomerMutation`. Also uses `PhotoUploader` to upload photo and then update `photo` via mutation.
  - **Customer List:** [app/(drawer)/(tabs)/(connects)/customers.tsx](app/(drawer)/(tabs)/(connects)/customers.tsx) — uses `useCustomerListQuery({ q })`, supports search, pull-to-refresh, and navigation to details page `/customer/details/{id}`.

- **API Interactions (store/api/customerApi.tsx):**
  - List/search: `/customer/search/{q}` — `useCustomerListQuery`.
  - Get by id / byTime: `/customer/byTime/{id}/{date}/{isDate}` — `useGetCustomerByIdQuery`.
  - Add: `POST /customer` — `useAddCustomerMutation`.
  - Update: `PUT /customer/{_id}` — `useUpdateCustomerMutation`.
  - Delete: `DELETE /customer/{id}` — `useDeleteCustomerMutation`.
  - Export, counts, pagination, contact endpoints available (`/customer/export/{warehouse}`, `/customer/count`, `/customer/all/{page}/{size}/{warehouse}`, etc.).

- **Data Flow & Notes:**
  - Add form enforces required fields and shows an alert if missing.
  - Photo upload handled by `PhotoUploader` component (used in update) — callback `onUploadSuccess` calls `updateCustomer` with the new `photo` URL.
  - List component updates local state from query results and uses router navigation to detail views.

**Common Patterns**
- Uses Redux Toolkit Query (`createApi`) with `BASE_URL` from `constants/baseUrl`.
- Tagging: endpoints use `tagTypes` ("Supplier", "Customer") and mutations invalidate tags to refresh lists.
- User context (`useGlobalContext`) supplies `userInfo` including `warehouse` which is attached to created records.
- Navigation: uses `expo-router` `router.push()` and `router.back()`.
- Image upload: `expo-image-picker` for selecting local images; `PhotoUploader` for upload flow in customers.

**Recommendations / Next Steps**
- Enable the commented Supplier Details implementation (or refactor) to provide ledger and transaction views — it contains useful month-by-month logic.
- Consistent validation: `add-customer.tsx` enforces fields but `add-supplier.tsx` does not; align required-field checks.
- Centralize photo upload flow: both supplier and customer code build a `photo` URI; consider sharing `PhotoUploader` for suppliers as well.
- Add error UI: mutations catch errors but currently only log to console; show user-facing errors (toasts/alerts).
- Add unit/integration tests for critical API flows (add/update/list) and form validation.

**Files to review for implementation details**
- [store/api/supplierApi.tsx](store/api/supplierApi.tsx)
- [store/api/customerApi.tsx](store/api/customerApi.tsx)
- [app/supplier/add-supplier.tsx](app/supplier/add-supplier.tsx)
- [app/supplier/[id].tsx](app/supplier/[id].tsx)
- [app/supplier/details/[id].tsx](app/supplier/details/[id].tsx)
- [app/customer/add-customer.tsx](app/customer/add-customer.tsx)
- [app/customer/[id].tsx](app/customer/[id].tsx)
- [app/(drawer)/(tabs)/(connects)/customers.tsx](app/(drawer)/(tabs)/(connects)/customers.tsx)

