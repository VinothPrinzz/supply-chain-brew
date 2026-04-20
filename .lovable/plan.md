

# New Pages & Dispatch Sheet Revamp

Adding 6 features across FGS, Masters, and a new **Finance** module. All pages use mock data via the existing `services/api.ts` + TanStack Query layer, TanStack `DataTable`, and react-hook-form + zod for forms — consistent with the production-ready architecture already in place.

---

## 1. Dispatch Sheet — Item & Crate Loading View (revamp)

Current page shows route-level totals only. Revamp `src/pages/fgs/DispatchSheetPage.tsx` to be a **loading checklist** for the dispatch person.

**Layout:**
- **Top filter bar:** Date picker, Route selector (or "All Routes"), Batch selector.
- **Summary strip:** Total Items, Total Packets, Total Crates, Total Routes.
- **Per-route accordion cards** — each expands to show:
  - Route header: Route name, Contractor, Vehicle No., Dispatch Time, Status badge.
  - **Item-wise loading table** (aggregated from all indents on that route):
    - Columns: `Product | Category | Pack | Total Packets | Packets/Crate | Crates | Loose Packets | Verified ✓`
    - Verified checkbox per row (local state — for dispatcher's tally).
  - Footer row: Total Packets, Total Crates.
  - Action buttons: **Print Loading Slip** (A4), **Mark Dispatched**.

**Logic:** aggregate `indents` (status Pending/Posted) by `routeId` → group items by `productId` → `crates = floor(qty / packetsPerCrate)`, `loose = qty % packetsPerCrate`.

---

## 2. Create Dispatch Page (new)

New route `/fgs/dispatch/create` → `src/pages/fgs/CreateDispatchPage.tsx`. Sidebar entry under **FGS - Stock**.

**Form (react-hook-form + zod):**
- Date, Route (dropdown), Batch (dropdown), Dispatch Time (auto-fills from Route, editable), Vehicle No. (auto-fills from Contractor, editable), Driver Name, Notes.
- **Indent selection panel:** lists pending indents for the selected route+batch+date with checkboxes; live totals (indents, crates, amount) update as user toggles.
- Submit → calls new `createDispatch()` API → adds to `dispatchEntries` → toast + redirect to Dispatch Sheet.

---

## 3. Price Revision Page (new)

New route `/masters/price-revisions` → `src/pages/masters/PriceRevisionsPage.tsx`. Sidebar entry under **Masters → Products**.

**Two tabs:**
- **All Revisions (list):** DataTable with columns `Revision ID | Product | Field (MRP / Rate Cat / GST) | Old Value | New Value | Effective From | Status (Scheduled/Active/Expired) | Created By | Actions (Cancel if Scheduled)`.
- **New Revision (form):** Product dropdown, Field type (MRP, Rate Category rate, GST%), New value, Effective-from datetime, optional Effective-until, Reason.

**Mock data:** new `priceRevisions: PriceRevision[]` array in `mockData.ts`; status auto-derived from current date vs. effective dates.

---

## 4. Invoices Page (new)

New route `/sales/invoices` → `src/pages/sales/InvoicesPage.tsx`. Sidebar entry under **Sales Operations → Invoices**.

**List view:** DataTable with `Invoice No. | Date | Customer | Route | Items Count | Subtotal | GST | Total | Pay Mode | Status (Paid/Unpaid/Partial) | View`.

**Click a row** → opens `InvoiceDetailPage` at `/sales/invoices/:id` rendered inside `ReportViewer` (existing A4 component) for fullscreen + print:
- Header: Company name, GSTIN, address, "TAX INVOICE", invoice no., date.
- Bill-to block: Customer name, address, GSTIN, route.
- Line items table: `Sl | Product | HSN | Qty | Pack | Rate | Basic | CGST% | CGST ₹ | SGST% | SGST ₹ | Total`.
- Totals block + amount-in-words + signature area.

**Mock:** generated from existing `indents` (one invoice per posted indent) via a helper in `services/api.ts`.

---

## 5. Payments Overview (new)

New route `/finance/payments` → `src/pages/finance/PaymentsPage.tsx`. New sidebar group **Finance**.

**Summary cards:** Total Receivable, Received Today, Outstanding, Overdue (>30 days).

**Two tabs:**
- **Payments list** — DataTable: `Receipt No. | Date | Customer | Mode (Cash/UPI/Cheque/Bank) | Reference | Amount | Allocated To (Invoice) | Status`.
- **Record Payment** — react-hook-form: Customer (search), Date, Mode, Reference, Amount, allocate to one or more outstanding invoices (auto-suggests oldest first).

**Mock:** new `payments: Payment[]` array.

---

## 6. Dealer Ledger / Wallet (new)

New route `/finance/ledger` → `src/pages/finance/LedgerPage.tsx`. Sidebar under **Finance**.

**Layout:**
- **Top:** Customer dropdown (searchable), Date range, Opening balance display, Print button.
- **Summary tiles:** Opening Balance, Total Debits (invoices), Total Credits (payments), Closing Balance, Credit Limit, Available Credit.
- **Ledger table:** `Date | Voucher Type (Invoice / Receipt / Adjustment / Opening) | Voucher No. | Particulars | Debit | Credit | Running Balance`.
- Rows are merged from invoices + payments, sorted by date, with running balance computed client-side.
- **Print View:** A4 statement via `ReportViewer` — header (customer details, period), ledger table, footer with closing balance.

---

## Shared / Infrastructure Changes

- **`src/data/mockData.ts`:** add interfaces & seed arrays for `PriceRevision`, `Invoice`, `Payment`, `LedgerEntry` (or derive ledger on the fly).
- **`src/services/api.ts`:** add `fetchInvoices`, `fetchInvoice(id)`, `fetchPayments`, `createPayment`, `fetchLedger(customerId, from, to)`, `fetchPriceRevisions`, `createPriceRevision`, `cancelPriceRevision`, `createDispatch`, `markRouteVerified`.
- **`src/lib/validations.ts`:** zod schemas for `priceRevisionSchema`, `paymentSchema`, `dispatchCreateSchema`.
- **`src/App.tsx`:** lazy-load 5 new pages; add routes.
- **`src/components/AppSidebar.tsx`:** add `Price Revisions` under Masters→Products, `Create Dispatch` under FGS, `Invoices` under Sales, and a new **Finance** group with `Payments` + `Dealer Ledger`.
- **`REPORTS_SPEC.md`:** append sections for Invoice and Ledger A4 layouts.

---

## File Map

**New:**
`src/pages/fgs/CreateDispatchPage.tsx`, `src/pages/masters/PriceRevisionsPage.tsx`, `src/pages/sales/InvoicesPage.tsx`, `src/pages/sales/InvoiceDetailPage.tsx`, `src/pages/finance/PaymentsPage.tsx`, `src/pages/finance/LedgerPage.tsx`

**Edited:**
`src/pages/fgs/DispatchSheetPage.tsx`, `src/data/mockData.ts`, `src/services/api.ts`, `src/lib/validations.ts`, `src/App.tsx`, `src/components/AppSidebar.tsx`, `REPORTS_SPEC.md`

