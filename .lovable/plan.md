
# Haveri Milk Union — Admin Panel (Web Application)

A modern web-based admin panel replacing the current desktop ERP marketing module. Built with React, using a **left sidebar + top bar** layout. All data is mock/sample for now — backend can be connected later.

---

## Navigation & Layout

- **Left Sidebar**: Collapsible, with grouped sections and sub-sections. Sections: Masters, Sales Operations, FGS, Reports, Sales Reports
- **Top Bar**: App title ("Haveri Dairy Unit — Marketing Module"), logged-in user info, fullscreen toggle
- **Content Area**: Where forms, tables, and reports render

---

## 1. Masters Section (Sidebar Group)

### 1.1 Customer
- **New Customer** form: Customer Code (auto-generated A1, A2...), Customer Name, Customer Type (dropdown: Retail-Dealer, Credit Institution-MRP, Credit Institution-Dealer, Parlour-Dealer), Rate Category, Bank, Pay Mode, Officer Name, Address fields, Status toggle
- **Assign Route**: Select a route → view table of assigned customers → add/remove customers from the route
- **Customer List**: Searchable/filterable table of all customers with edit/view actions

### 1.2 Contractor
- **New Contractor** form: Contractor Name, Contact, Address, Status
- **Contractor List**: Table with arrow navigation between entries (prev/next)

### 1.3 Route
- **New Route** form: Route Code, Route Name, Description
- **Route List**: View all routes

### 1.4 Distribution Batch
- **New Batch** form: Batch Code, Batch Name, Timing
- **Batch List**: Table view

### 1.5 Milk/Product
- **Add Packet**: Code (auto), Packet Name (searchable dropdown), Report Alias, Product Category, Pack Size, Unit (kg/ltr), MRP, GST%, CGST, SGST, HSN No., Subsidy (yes/no), Sub Rate, Indent in Box, Box Qty, Sort Position, Make Zero in Indents toggle, Packets/Crate, Print Direction (Across/Down), Terminated toggle
- **Assign Rate Category**: Select packet → assign rates per rate category (Retail-Dealer, Credit Institution-MRP, etc.)
- **Product List**: Full searchable table

### 1.6 Address
- Simple address management form (linked to customers/entities)

### 1.7 Price Chart
- View price charts per rate category (Retail-Dealer, Credit Inst-MRP, etc.)
- Tab/arrow navigation between different rate category charts
- Print-ready A4 format

---

## 2. Sales Operations Section

### 2.1 Sales Through Routes
- **Reset Indents**: Confirmation dialog with username/password verification, resets indents for the day
- **Record Indents**: Select batch (searchable dropdown) → enter indent date → enter agent code → GO → shows indent details table with product quantities

### 2.2 Direct Sales
- **Adhoc Sales — Gate Pass (Agents)**: Emergency sales entry form with agent selection, product quantities, gate pass generation
- **Adhoc Sales — Cash Customer**: Advance-paid customer sales entry
- **Modify Indent**: Edit existing indents

### 2.3 Post Indent
- Select route and batch → "Post" button clubs all indents for that route → generates route sheets
- Confirmation dialog before posting

---

## 3. FGS (Finished Goods Store) — NEW Module

### 3.1 Stock Dashboard
- Current stock levels for all products in a summary table/cards
- Low stock alerts

### 3.2 Stock Entry
- Record stock received from production (product, quantity, batch, date)
- Record stock dispatched (auto-linked when indents are posted)
- Manual stock adjustments (wastage, returns, damages)

### 3.3 Stock Reports
- Daily stock position report (opening stock, received, dispatched, closing stock)
- Stock movement history with date filters
- Stock reconciliation view

### 3.4 Dispatch Integration
- When indents are posted → stock auto-deducts from FGS
- View pending dispatches vs available stock
- Shortage alerts if indent exceeds stock

---

## 4. Reports Section

### 4.1 Route Sheet
- Select batch, date → generate route sheet
- Multi-page report with **arrow navigation** (← →) between pages
- **Fullscreen mode** button
- **Print Preview** in A4 format
- Shows: Route name, customer-wise product quantities, totals
- Products marked "Across" get their own columns; "Down" products go in an "Other Products" column

### 4.2 Gate Pass Sales Report
- Select date range → generates gate pass sales report
- Arrow navigation, fullscreen, print preview (A4)

---

## 5. Sales Reports Section

All reports share a common pattern:
- **Date range picker** (From date — To date) at the top
- **Generate** button
- **Report viewer** with: page navigation arrows (← Page X of Y →), fullscreen toggle, print button (A4 optimized), zoom controls

### 5.1 Daily Sales Statement (DMU Items)
- For own-production items only (milk, curd, lassi, buttermilk)
- Multi-page tabular report with product quantities and values

### 5.2 Day/Route Wise Cash Sales
- Breakdown by day and route with product quantities and amounts

### 5.3 Officer Wise Sales (Qty)
- Sales grouped by officer with quantity breakdowns

### 5.4 Cash Sales
- Daily-payment customers' sales report with totals

### 5.5 Credit Sales
- Monthly-payment institutions' sales, navigable by institution (arrow buttons)
- Per-institution breakdown with totals

### 5.6 Sales Register
- Combined cash + credit sales total report

### 5.7 Taluka/Agent Wise Sales
- Sales grouped by taluka and agent, navigable by route (arrow buttons)

### 5.8 Adhoc Sales Abstract
- Emergency/ad-hoc sales summary report

### 5.9 GST Sales Statement
- GST-compliant sales statement with tax breakdowns (CGST, SGST, taxable value)

---

## Shared Report Viewer Component

A reusable component used across all reports:
- **Page navigation**: ← → arrows with "Page X of Y" indicator
- **Fullscreen mode**: Expand report to full browser window
- **Print**: Opens browser print dialog, optimized for A4 paper
- **Date range selector**: Calendar date pickers for "From" and "To" dates
- Clean tabular layout with proper headers, borders, and totals rows

---

## Design Approach

- **Clean, simple UI** suitable for non-technical dairy staff
- **Muted color palette**: White background, dark text, blue accent for actions
- Large, readable fonts and generous spacing
- Tables with alternating row colors for readability
- Forms with clear labels and validation messages
- Print styles ensure clean A4 output without navigation elements
