/**
 * Simulated async API service layer.
 * All data fetching goes through here so we can swap to real backend later.
 */
import {
  products, customers, routes, contractors, batches,
  indents, stockEntries, cancellationRequests, dispatchEntries,
  timeWindows, notificationSettings, banners, systemUsers, roles,
  agents, officers, rateCategories,
  type Product, type Customer, type Route, type Contractor,
  type DistributionBatch, type Indent, type StockEntry,
  type CancellationRequest, type DispatchEntry,
  type TimeWindow, type NotificationSetting, type Banner, type SystemUser,
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

// ===== HELPERS (static, no fetch needed) =====
export const getAgents = () => agents;
export const getOfficers = () => officers;
export const getRateCategories = () => rateCategories;
