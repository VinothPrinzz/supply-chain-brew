/**
 * Simulated async API service layer.
 * All data fetching goes through here so we can swap to real backend later.
 */
import {
  products, customers, routes, contractors, batches,
  indents, stockEntries, cancellationRequests, dispatchEntries,
  timeWindows, notificationSettings, banners, systemUsers, roles,
  agents, officers, rateCategories,
  priceRevisions, invoices, payments,
  type Product, type Customer, type Route, type Contractor,
  type DistributionBatch, type Indent, type StockEntry,
  type CancellationRequest, type DispatchEntry,
  type TimeWindow, type NotificationSetting, type Banner, type SystemUser,
  type PriceRevision, type Invoice, type Payment, type PaymentAllocation,
} from "@/data/mockData";

// Simulate network delay
const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

// ===== PRODUCTS =====
export const fetchProducts = async (): Promise<Product[]> => {
  await delay();
  return [...products];
};

export const createProduct = async (data: Partial<Product>): Promise<Product> => {
  await delay(300);
  const newProduct: Product = {
    id: `P${products.length + 1}`,
    code: `00${products.length + 1}`,
    name: data.name || "",
    reportAlias: data.reportAlias || "",
    category: data.category || "Other",
    packSize: data.packSize || 0,
    unit: data.unit || "pcs",
    mrp: data.mrp || 0,
    gstPercent: data.gstPercent || 0,
    cgst: data.cgst || 0,
    sgst: data.sgst || 0,
    hsnNo: data.hsnNo || "",
    subsidy: data.subsidy || false,
    subRate: data.subRate || 0,
    indentInBox: data.indentInBox || false,
    boxQty: data.boxQty || 0,
    sortPosition: data.sortPosition || 0,
    makeZero: data.makeZero || false,
    packetsPerCrate: data.packetsPerCrate || 0,
    printDirection: data.printDirection || "Across",
    terminated: data.terminated || false,
    rateCategories: data.rateCategories || {},
    stock: data.stock || 0,
  };
  products.push(newProduct);
  return newProduct;
};

// ===== CUSTOMERS =====
export const fetchCustomers = async (): Promise<Customer[]> => {
  await delay();
  return [...customers];
};

export const createCustomer = async (data: Partial<Customer>): Promise<Customer> => {
  await delay(300);
  const newCustomer: Customer = {
    id: `C${customers.length + 1}`,
    code: `A${customers.length + 1}`,
    name: data.name || "",
    type: data.type || "Retail-Dealer",
    rateCategory: data.rateCategory || "Retail-Dealer",
    bank: data.bank || "",
    payMode: data.payMode || "Cash",
    officerName: data.officerName || "",
    address: data.address || "",
    city: data.city || "",
    phone: data.phone || "",
    status: data.status || "Active",
    routeId: data.routeId || "",
    creditBalance: data.creditBalance || 0,
  };
  customers.push(newCustomer);
  return newCustomer;
};

export const removeCustomerFromRoute = async (customerId: string): Promise<void> => {
  await delay(200);
  const cust = customers.find(c => c.id === customerId);
  if (cust) cust.routeId = "";
};

// ===== ROUTES =====
export const fetchRoutes = async (): Promise<Route[]> => {
  await delay();
  return [...routes];
};

export const createRoute = async (data: Partial<Route>): Promise<Route> => {
  await delay(300);
  const newRoute: Route = {
    id: `R${routes.length + 1}`,
    code: data.code || "",
    name: data.name || "",
    taluka: data.taluka || "",
    contractorId: data.contractorId || "",
    dispatchTime: data.dispatchTime || "",
    status: data.status || "Active",
    description: data.description || "",
  };
  routes.push(newRoute);
  return newRoute;
};

// ===== CONTRACTORS =====
export const fetchContractors = async (): Promise<Contractor[]> => {
  await delay();
  return [...contractors];
};

export const createContractor = async (data: Partial<Contractor>): Promise<Contractor> => {
  await delay(300);
  const newCt: Contractor = {
    id: `CT${contractors.length + 1}`,
    name: data.name || "",
    contact: data.contact || "",
    address: data.address || "",
    vehicleNo: data.vehicleNo || "",
    status: data.status || "Active",
    assignedRouteIds: data.assignedRouteIds || [],
  };
  contractors.push(newCt);
  return newCt;
};

// ===== BATCHES =====
export const fetchBatches = async (): Promise<DistributionBatch[]> => {
  await delay();
  return [...batches];
};

export const createBatch = async (data: Partial<DistributionBatch>): Promise<DistributionBatch> => {
  await delay(300);
  const newBatch: DistributionBatch = {
    id: `B${batches.length + 1}`,
    code: data.code || "",
    name: data.name || `${data.whichBatch} Batch`,
    whichBatch: data.whichBatch || "",
    timing: data.timing || "",
    routeIds: data.routeIds || [],
    status: data.status || "Active",
  };
  batches.push(newBatch);
  return newBatch;
};

// ===== INDENTS =====
export const fetchIndents = async (): Promise<Indent[]> => {
  await delay();
  return [...indents];
};

export const createIndent = async (data: Partial<Indent>): Promise<Indent> => {
  await delay(300);
  const newIndent: Indent = {
    id: `IND${String(indents.length + 1).padStart(3, '0')}`,
    customerId: data.customerId || "",
    batchId: data.batchId || "",
    routeId: data.routeId || "",
    date: data.date || new Date().toISOString().slice(0, 10),
    items: data.items || [],
    status: "Pending",
    agentCode: data.agentCode || "",
    totalAmount: data.totalAmount || 0,
    gstAmount: data.gstAmount || 0,
  };
  indents.push(newIndent);
  return newIndent;
};

export const postIndents = async (routeId: string, batchId: string): Promise<number> => {
  await delay(400);
  let count = 0;
  indents.forEach(i => {
    if (i.routeId === routeId && i.batchId === batchId && i.status === "Pending") {
      i.status = "Posted";
      count++;
    }
  });
  return count;
};

export const resetIndents = async (_username: string, _password: string): Promise<void> => {
  await delay(400);
  // Mock: reset today's pending indents
};

// ===== STOCK =====
export const fetchStockEntries = async (): Promise<StockEntry[]> => {
  await delay();
  return [...stockEntries];
};

export const saveStockEntries = async (
  _entries: Record<string, { received: number; dispatch: number; wastage: number }>,
  _date: string,
  _username: string,
  _password: string
): Promise<void> => {
  await delay(400);
};

// ===== CANCELLATIONS =====
export const fetchCancellationRequests = async (): Promise<CancellationRequest[]> => {
  await delay();
  return [...cancellationRequests];
};

export const approveCancellation = async (id: string): Promise<void> => {
  await delay(300);
  const req = cancellationRequests.find(r => r.id === id);
  if (req) req.status = "Approved";
};

export const rejectCancellation = async (id: string, reason: string): Promise<void> => {
  await delay(300);
  const req = cancellationRequests.find(r => r.id === id);
  if (req) {
    req.status = "Rejected";
    req.rejectionReason = reason;
  }
};

// ===== DISPATCH =====
export const fetchDispatchEntries = async (): Promise<DispatchEntry[]> => {
  await delay();
  return [...dispatchEntries];
};

export const dispatchRoute = async (id: string): Promise<void> => {
  await delay(300);
  const entry = dispatchEntries.find(d => d.id === id);
  if (entry) entry.status = "Dispatched";
};

// ===== SYSTEM =====
export const fetchTimeWindows = async (): Promise<TimeWindow[]> => {
  await delay();
  return [...timeWindows];
};

export const updateTimeWindow = async (id: string, data: Partial<TimeWindow>): Promise<void> => {
  await delay(300);
  const tw = timeWindows.find(t => t.id === id);
  if (tw) Object.assign(tw, data);
};

export const fetchNotificationSettings = async (): Promise<NotificationSetting[]> => {
  await delay();
  return [...notificationSettings];
};

export const fetchBanners = async (): Promise<Banner[]> => {
  await delay();
  return [...banners];
};

export const createBanner = async (data: Partial<Banner>): Promise<Banner> => {
  await delay(300);
  const newBanner: Banner = {
    id: `BN${banners.length + 1}`,
    title: data.title || "",
    category: data.category || "Announcement",
    imageUrl: "/placeholder.svg",
    linkUrl: "#",
    status: "Active",
    startDate: data.startDate || "",
    endDate: data.endDate || "",
  };
  banners.push(newBanner);
  return newBanner;
};

export const deleteBanner = async (id: string): Promise<void> => {
  await delay(200);
  const idx = banners.findIndex(b => b.id === id);
  if (idx >= 0) banners.splice(idx, 1);
};

export const fetchSystemUsers = async (): Promise<SystemUser[]> => {
  await delay();
  return [...systemUsers];
};

export const fetchRoles = async () => {
  await delay();
  return [...roles];
};

export const updateRolePermissions = async (role: string, permissions: string[]): Promise<void> => {
  await delay(300);
  const r = roles.find(ro => ro.role === role);
  if (r) r.permissions = permissions;
};

// ===== PRICE REVISIONS =====
export const fetchPriceRevisions = async (): Promise<PriceRevision[]> => {
  await delay();
  return [...priceRevisions].sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom));
};

export const createPriceRevision = async (data: Partial<PriceRevision>): Promise<PriceRevision> => {
  await delay(300);
  const product = products.find(p => p.id === data.productId);
  let oldValue = 0;
  if (product) {
    if (data.field === "MRP") oldValue = product.mrp;
    else if (data.field === "GST") oldValue = product.gstPercent;
    else if (data.field === "RateCategory" && data.rateCategory) oldValue = product.rateCategories[data.rateCategory] ?? 0;
  }
  const pr: PriceRevision = {
    id: `PR${priceRevisions.length + 1}`,
    productId: data.productId || "",
    field: (data.field || "MRP") as PriceRevision["field"],
    rateCategory: data.rateCategory,
    oldValue,
    newValue: data.newValue || 0,
    effectiveFrom: data.effectiveFrom || new Date().toISOString().slice(0, 16),
    effectiveUntil: data.effectiveUntil,
    reason: data.reason || "",
    createdBy: "Admin User",
    createdAt: new Date().toISOString().slice(0, 16),
  };
  priceRevisions.push(pr);
  return pr;
};

export const cancelPriceRevision = async (id: string): Promise<void> => {
  await delay(200);
  const idx = priceRevisions.findIndex(p => p.id === id);
  if (idx >= 0) priceRevisions.splice(idx, 1);
};

// ===== INVOICES =====
export const fetchInvoices = async (): Promise<Invoice[]> => {
  await delay();
  return [...invoices];
};

export const fetchInvoice = async (id: string): Promise<Invoice | undefined> => {
  await delay();
  return invoices.find(i => i.id === id);
};

// ===== PAYMENTS =====
export const fetchPayments = async (): Promise<Payment[]> => {
  await delay();
  return [...payments].sort((a, b) => b.date.localeCompare(a.date));
};

export const createPayment = async (data: Partial<Payment>): Promise<Payment> => {
  await delay(300);
  const pay: Payment = {
    id: `PAY${payments.length + 1}`,
    receiptNo: `RCT-${String(payments.length + 1).padStart(4, "0")}`,
    date: data.date || new Date().toISOString().slice(0, 10),
    customerId: data.customerId || "",
    mode: data.mode || "Cash",
    reference: data.reference || "-",
    amount: data.amount || 0,
    allocations: data.allocations || [],
    notes: data.notes,
  };
  payments.push(pay);
  // Update invoice statuses based on allocations
  pay.allocations.forEach(a => {
    const inv = invoices.find(i => i.id === a.invoiceId);
    if (inv) {
      inv.amountPaid = +(inv.amountPaid + a.amount).toFixed(2);
      inv.status = inv.amountPaid >= inv.total ? "Paid" : inv.amountPaid > 0 ? "Partial" : "Unpaid";
    }
  });
  return pay;
};

// ===== LEDGER =====
export interface LedgerRow {
  date: string;
  voucherType: "Opening" | "Invoice" | "Receipt";
  voucherNo: string;
  particulars: string;
  debit: number;
  credit: number;
  balance: number;
}

export const fetchLedger = async (
  customerId: string,
  from?: string,
  to?: string
): Promise<{ opening: number; rows: LedgerRow[]; closing: number }> => {
  await delay(300);
  const cust = customers.find(c => c.id === customerId);
  const opening = 0; // simplified opening balance
  const invs = invoices
    .filter(i => i.customerId === customerId && (!from || i.date >= from) && (!to || i.date <= to))
    .map<LedgerRow>(i => ({
      date: i.date, voucherType: "Invoice", voucherNo: i.id,
      particulars: `Sales as per Invoice ${i.id}`, debit: i.total, credit: 0, balance: 0,
    }));
  const pays = payments
    .filter(p => p.customerId === customerId && (!from || p.date >= from) && (!to || p.date <= to))
    .map<LedgerRow>(p => ({
      date: p.date, voucherType: "Receipt", voucherNo: p.receiptNo,
      particulars: `${p.mode} Receipt ${p.reference}`, debit: 0, credit: p.amount, balance: 0,
    }));
  const merged = [...invs, ...pays].sort((a, b) => a.date.localeCompare(b.date));
  let bal = opening;
  merged.forEach(r => { bal = +(bal + r.debit - r.credit).toFixed(2); r.balance = bal; });
  const head: LedgerRow = { date: from || "", voucherType: "Opening", voucherNo: "-", particulars: `Opening Balance — ${cust?.name || ""}`, debit: 0, credit: 0, balance: opening };
  return { opening, rows: [head, ...merged], closing: bal };
};

// ===== DISPATCH EXTRA =====
export const createDispatch = async (data: Partial<DispatchEntry> & { indentIds?: string[] }): Promise<DispatchEntry> => {
  await delay(300);
  const totalAmount = (data.indentIds || []).reduce((s, id) => {
    const ind = indents.find(i => i.id === id);
    return s + (ind?.totalAmount || 0);
  }, 0);
  const entry: DispatchEntry = {
    id: `D${dispatchEntries.length + 1}`,
    routeId: data.routeId || "",
    date: data.date || new Date().toISOString().slice(0, 10),
    totalIndents: data.indentIds?.length || 0,
    totalCrates: data.totalCrates || 0,
    totalAmount,
    dispatchTime: data.dispatchTime || "",
    status: "Pending",
  };
  dispatchEntries.push(entry);
  return entry;
};

// ===== HELPERS (static, no fetch needed) =====
export const getAgents = () => agents;
export const getOfficers = () => officers;
export const getRateCategories = () => rateCategories;
