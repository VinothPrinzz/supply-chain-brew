# Reports & Sales Reports — Page-by-Page Specification

This document describes every report screen in the admin panel: how many pages each report produces, the table columns on each page, header/footer rows, and the filters that drive them. Use this as the source of truth when wiring the backend.

> **Conventions used below**
> - "Products span" = one column per active product (dynamically generated from the products master). Backend should return products in the order they appear in the products master.
> - "Active products" = `products.filter(p => !p.terminated)`.
> - **Crates** = `Math.ceil(totalQty / packetsPerCrate)` (default 20).
> - **Rate resolution** = `product.rateCategories[customer.rateCategory] ?? product.mrp`.
> - All reports support **A4 print**, **fullscreen**, **page navigation** and **zoom** via the shared `ReportViewer`.
> - Wide product spans use compact font (`text-[10px]`) + `whitespace-nowrap`. Backend can ignore styling — it only needs to provide rows.

---

## A. REPORTS module

### A1. Route Sheet
**Filters:** `batch` (dropdown), `date` (single date)
**Pages:** One page **per active route** (N pages = number of routes).

**Header (per page):**
- Route Name, Route Code
- Contractor name, Vehicle No., Dispatch Time
- Batch name, Date

**Table columns:**
| Sl | Customer Name | <Across-products span (qty)> | Other Products | Net Amount | Crates |

- "Across-products" = products whose `printDirection === "Across"` — each gets its own qty column.
- "Other Products" = single column listing `Down`-direction products as "Name x Qty, Name x Qty…".
- **Last row:** TOTAL across all customers — totals for each across-product, total amount, total crates. Customer column shows "TOTAL".

---

### A2. Gate Pass Sales Report
**Filters:** `fromDate`, `toDate`
**Pages:** Single multi-page report (paginated by row count, ~20 rows/page).

**Table columns:**
| GP No. | Date | Agent Name | Items (multi-line: "Product x Qty") | Amount |

- **Last row:** TOTAL — sum of `Amount` column.

---

## B. SALES REPORTS module

All sales reports share the same shell: `From Date`, `To Date`, `Generate` button, then ReportViewer.

---

### B1. Daily Sales Statement (DMU Items)
**Pages: 3** — segregated by product category.

#### Page 1 — Milk Items
**Columns:** `Date | <Milk products span (qty)> | Total Amount`
- One row per date in range.
- Last row: `TOTAL | sum per product | sum of amounts`.

#### Page 2 — Curd Items
**Columns:** `Date | <Curd products span (qty)> | Total Amount`
- Same row/total logic as Page 1.

#### Page 3 — Lassi & Majige (Buttermilk) Items
**Columns:** `Date | <Lassi+Buttermilk products span (qty)> | Total Amount`
- Same row/total logic.

---

### B2. Day / Route Wise Cash Sales
**Pages: 1** (multi-page if many dates).

**Columns:** `Indent Date | <Active routes span (amount per route)> | Total`
- One row per date.
- Each route cell = total cash-sales amount for that route on that date.
- Last row: `TOTAL | sum per route | grand total`.

---

### B3. Officer Wise Sales (Qty)
**Pages: 1**

**Columns:** `Product | <Officers span (qty)> | Total`
- One row per active product.
- Each officer cell = total quantity of that product attributed to that officer in the date range.
- Last row: `TOTAL | sum per officer | grand total qty`.

---

### B4. Cash Sales Statement
**Pages: 2**

#### Page 1 — Product-wise breakdown
**Columns:** `Route Code | Route Name | <Active products span (qty)> | Total`
- One row per route.
- Last row: `TOTAL | — | sum per product | grand total amount`.

#### Page 2 — Summary
**Columns:** `Route Code | Route Name | Milk Amount | Product Amount | Total | Contractor`
- `Milk Amount` = total of all milk-category product amounts for that route.
- `Product Amount` = total of all NON-milk product amounts.
- `Total` = Milk Amount + Product Amount.
- `Contractor` = contractor assigned to the route.
- Last row: `TOTAL | — | sum | sum | sum | —`.

---

### B5. Credit Sales
**Pages: N + 1** where N = number of credit-customers with sales in the period.

#### Pages 1..N — Per-customer Tax Invoice
**Header:** Customer name, address, GSTIN, invoice date, invoice no.

**Columns:** `Sl | Product | HSN | Qty | Rate | Basic Amount | CGST% | CGST Amt | SGST% | SGST Amt | Total Amount`
- One row per product purchased by that customer in the range.
- Last row: invoice totals — `TOTAL | — | — | sum qty | — | sum basic | — | sum cgst | — | sum sgst | sum total`.

#### Final Page — Credit Sales Summary
**Columns:** `Sl | Customer Code | Customer Name | Basic | CGST | SGST | Total Amount`
- One row per credit customer.
- Last row: `TOTAL | — | — | sum basic | sum cgst | sum sgst | grand total`.

---

### B6. Sales Register (Cash + Credit combined)
**Pages: 2** — same structure as Cash Sales.

#### Page 1
**Columns:** `Route Code | Route Name | <Active products span (qty)> | Total`

#### Page 2
**Columns:** `Route Code | Route Name | Milk Amount | Product Amount | Total Amount | Contractor Name`

Both pages end with a TOTAL row identical to the Cash Sales report.

---

### B7. Taluka / Agent Wise Sales
**Pages: 2 per taluka** (so total = 2 × number of talukas).

#### Page 1 (per taluka) — Detailed
**Header:** `Taluka Name: <name>`
**Columns:** `S.No | Code | Customer Name | <Active products span (qty)> | Total`
- One row per customer in that taluka.
- Last row: `TOTAL | — | — | sum per product | grand total`.

#### Page 2 (per taluka) — Summary
**Header:** `Taluka Name: <name>`
**Columns:** `S.No | Code | Customer Name | Cookies 20gm | Butter Cookies 100gm | Kodubale 180gm | Paneer Nippattu 400gm | Milk Total Qty | Curd Total Qty | Total Amount (₹)`
- "Milk Total Qty" = sum of qty across all milk-category products for the customer.
- "Curd Total Qty" = sum of qty across all curd-category products.
- The 4 named cookie/savoury items are fixed columns mapped by product code (configurable).
- Last row: `TOTAL | — | — | sums per column`.

---

### B8. Adhoc Sales Abstract
**Pages: 1** (paginated by row count).

**Columns:** `S.No | Indent Date | GP No. | Customer Name | Amount`
- One row per adhoc/gate-pass entry.
- Last row: `TOTAL | — | — | — | sum amount`.

---

### B9. GST Sales Statement
**Pages: 1** (paginated by row count).

**Columns:** `Sl | Product | HSN | Qty | GST% | Taxable Value | CGST | SGST | Total Tax | Invoice Value`
- One row per product.
- `Taxable Value` = qty × basic rate (pre-tax).
- `Invoice Value` = `Taxable Value + Total Tax`.
- Last row: `TOTAL | — | — | sum qty | — | sum taxable | sum cgst | sum sgst | sum tax | sum invoice value`.

---

## C. Cross-cutting backend notes

1. **Date filtering:** every report accepts `fromDate` & `toDate` (ISO `YYYY-MM-DD`). Route Sheet uses `batchId` + single `date`.
2. **Product ordering:** preserve `sortPosition` from the products master so column order is stable.
3. **Empty cells:** return `0` for missing qty / `0.00` for amounts — never `null` (frontend renders directly).
4. **Rounding:** quantities = integer; amounts = 2 decimals; tax % = 2 decimals.
5. **Pagination:** for reports with "1 page" but many rows (B2, B8, B9, A2), backend can return all rows — frontend paginates visually for print. Per-route / per-customer / per-taluka splits MUST be done server-side so each entity is its own logical page.
6. **Wide spans:** if product count > ~15 the table won't fit A4 portrait. Frontend handles via compact font + horizontal scroll on screen; print falls back to landscape (planned). Backend doesn't need to chunk columns.
