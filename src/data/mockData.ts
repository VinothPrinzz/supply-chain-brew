// ===== PRODUCTS =====
export interface Product {
  id: string;
  code: string;
  name: string;
  reportAlias: string;
  category: string;
  packSize: number;
  unit: "kg" | "ltr" | "pcs";
  mrp: number;
  gstPercent: number;
  cgst: number;
  sgst: number;
  hsnNo: string;
  subsidy: boolean;
  subRate: number;
  indentInBox: boolean;
  boxQty: number;
  sortPosition: number;
  makeZero: boolean;
  packetsPerCrate: number;
  printDirection: "Across" | "Down";
  terminated: boolean;
  rateCategories: Record<string, number>;
}

export const products: Product[] = [
  { id: "P1", code: "001", name: "Nandini Toned Milk 500ml", reportAlias: "TM 500", category: "Milk", packSize: 0.5, unit: "ltr", mrp: 24, gstPercent: 0, cgst: 0, sgst: 0, hsnNo: "0401", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 1, makeZero: false, packetsPerCrate: 20, printDirection: "Across", terminated: false, rateCategories: { "Retail-Dealer": 22.5, "Credit Inst-MRP": 24, "Credit Inst-Dealer": 22.5, "Parlour-Dealer": 22 } },
  { id: "P2", code: "002", name: "Nandini Full Cream Milk 500ml", reportAlias: "FCM 500", category: "Milk", packSize: 0.5, unit: "ltr", mrp: 30, gstPercent: 0, cgst: 0, sgst: 0, hsnNo: "0401", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 2, makeZero: false, packetsPerCrate: 20, printDirection: "Across", terminated: false, rateCategories: { "Retail-Dealer": 28, "Credit Inst-MRP": 30, "Credit Inst-Dealer": 28, "Parlour-Dealer": 27.5 } },
  { id: "P3", code: "003", name: "Nandini Curd 500ml", reportAlias: "Curd 500", category: "Curd", packSize: 0.5, unit: "kg", mrp: 30, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "0403", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 3, makeZero: false, packetsPerCrate: 12, printDirection: "Across", terminated: false, rateCategories: { "Retail-Dealer": 28, "Credit Inst-MRP": 30, "Credit Inst-Dealer": 28, "Parlour-Dealer": 27 } },
  { id: "P4", code: "004", name: "Nandini Buttermilk 200ml", reportAlias: "BM 200", category: "Buttermilk", packSize: 0.2, unit: "ltr", mrp: 10, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0403", subsidy: false, subRate: 0, indentInBox: true, boxQty: 30, sortPosition: 4, makeZero: false, packetsPerCrate: 30, printDirection: "Across", terminated: false, rateCategories: { "Retail-Dealer": 9, "Credit Inst-MRP": 10, "Credit Inst-Dealer": 9, "Parlour-Dealer": 8.5 } },
  { id: "P5", code: "005", name: "Nandini Lassi 200ml", reportAlias: "Lassi 200", category: "Lassi", packSize: 0.2, unit: "ltr", mrp: 15, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0403", subsidy: false, subRate: 0, indentInBox: true, boxQty: 24, sortPosition: 5, makeZero: false, packetsPerCrate: 24, printDirection: "Down", terminated: false, rateCategories: { "Retail-Dealer": 13.5, "Credit Inst-MRP": 15, "Credit Inst-Dealer": 13.5, "Parlour-Dealer": 13 } },
  { id: "P6", code: "006", name: "Nandini Ghee 500ml", reportAlias: "Ghee 500", category: "Ghee", packSize: 0.5, unit: "ltr", mrp: 275, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0405", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 6, makeZero: false, packetsPerCrate: 12, printDirection: "Down", terminated: false, rateCategories: { "Retail-Dealer": 260, "Credit Inst-MRP": 275, "Credit Inst-Dealer": 260, "Parlour-Dealer": 255 } },
  { id: "P7", code: "007", name: "Nandini Peda 250g", reportAlias: "Peda 250", category: "Sweets", packSize: 0.25, unit: "kg", mrp: 120, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "1704", subsidy: false, subRate: 0, indentInBox: true, boxQty: 20, sortPosition: 7, makeZero: true, packetsPerCrate: 20, printDirection: "Down", terminated: false, rateCategories: { "Retail-Dealer": 112, "Credit Inst-MRP": 120, "Credit Inst-Dealer": 112, "Parlour-Dealer": 110 } },
  { id: "P8", code: "008", name: "Nandini Paneer 200g", reportAlias: "Paneer 200", category: "Paneer", packSize: 0.2, unit: "kg", mrp: 90, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "0406", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 8, makeZero: true, packetsPerCrate: 15, printDirection: "Down", terminated: false, rateCategories: { "Retail-Dealer": 84, "Credit Inst-MRP": 90, "Credit Inst-Dealer": 84, "Parlour-Dealer": 82 } },
];

// ===== CUSTOMERS =====
export interface Customer {
  id: string;
  code: string;
  name: string;
  type: "Retail-Dealer" | "Credit Inst-MRP" | "Credit Inst-Dealer" | "Parlour-Dealer";
  rateCategory: string;
  bank: string;
  payMode: "Cash" | "Credit";
  officerName: string;
  address: string;
  city: string;
  phone: string;
  status: "Active" | "Inactive";
  routeId: string;
}

export const customers: Customer[] = [
  { id: "C1", code: "A1", name: "Sri Lakshmi Dairy", type: "Retail-Dealer", rateCategory: "Retail-Dealer", bank: "SBI", payMode: "Cash", officerName: "Ramesh K", address: "Main Road, Haveri", city: "Haveri", phone: "9876543210", status: "Active", routeId: "R1" },
  { id: "C2", code: "A2", name: "Govt. Hospital Haveri", type: "Credit Inst-MRP", rateCategory: "Credit Inst-MRP", bank: "Canara Bank", payMode: "Credit", officerName: "Suresh M", address: "Hospital Road", city: "Haveri", phone: "9876543211", status: "Active", routeId: "R1" },
  { id: "C3", code: "A3", name: "Hotel Sagar", type: "Credit Inst-Dealer", rateCategory: "Credit Inst-Dealer", bank: "SBI", payMode: "Credit", officerName: "Ramesh K", address: "Station Road", city: "Haveri", phone: "9876543212", status: "Active", routeId: "R2" },
  { id: "C4", code: "A4", name: "Nandini Parlour MG Road", type: "Parlour-Dealer", rateCategory: "Parlour-Dealer", bank: "BOB", payMode: "Cash", officerName: "Mahesh P", address: "MG Road", city: "Haveri", phone: "9876543213", status: "Active", routeId: "R2" },
  { id: "C5", code: "A5", name: "Maruthi Stores", type: "Retail-Dealer", rateCategory: "Retail-Dealer", bank: "SBI", payMode: "Cash", officerName: "Suresh M", address: "Market Road", city: "Ranebennur", phone: "9876543214", status: "Active", routeId: "R3" },
  { id: "C6", code: "A6", name: "KMF Parlour Bus Stand", type: "Parlour-Dealer", rateCategory: "Parlour-Dealer", bank: "SBI", payMode: "Cash", officerName: "Mahesh P", address: "Bus Stand", city: "Haveri", phone: "9876543215", status: "Active", routeId: "R1" },
  { id: "C7", code: "A7", name: "District School", type: "Credit Inst-MRP", rateCategory: "Credit Inst-MRP", bank: "PNB", payMode: "Credit", officerName: "Ramesh K", address: "School Road", city: "Byadgi", phone: "9876543216", status: "Inactive", routeId: "R4" },
  { id: "C8", code: "A8", name: "New Fresh Dairy", type: "Retail-Dealer", rateCategory: "Retail-Dealer", bank: "SBI", payMode: "Cash", officerName: "Suresh M", address: "Gandhi Nagar", city: "Savanur", phone: "9876543217", status: "Active", routeId: "R5" },
];

// ===== ROUTES =====
export interface Route {
  id: string;
  code: string;
  name: string;
  description: string;
}

export const routes: Route[] = [
  { id: "R1", code: "RT01", name: "Haveri City Route 1", description: "Main city route covering MG Road, Station Road, Hospital Road" },
  { id: "R2", code: "RT02", name: "Haveri City Route 2", description: "City route covering Market Area, Gandhi Nagar" },
  { id: "R3", code: "RT03", name: "Ranebennur Route", description: "Ranebennur town delivery route" },
  { id: "R4", code: "RT04", name: "Byadgi Route", description: "Byadgi town delivery" },
  { id: "R5", code: "RT05", name: "Savanur Route", description: "Savanur area delivery" },
  { id: "R6", code: "RT06", name: "Hirekerur Route", description: "Hirekerur town delivery" },
];

// ===== CONTRACTORS =====
export interface Contractor {
  id: string;
  name: string;
  contact: string;
  address: string;
  status: "Active" | "Inactive";
}

export const contractors: Contractor[] = [
  { id: "CT1", name: "Karnataka Transport Co.", contact: "9876500001", address: "Industrial Area, Haveri", status: "Active" },
  { id: "CT2", name: "Sree Logistics", contact: "9876500002", address: "NH-4 Highway, Haveri", status: "Active" },
  { id: "CT3", name: "Raghavendra Transports", contact: "9876500003", address: "Station Road, Ranebennur", status: "Inactive" },
];

// ===== DISTRIBUTION BATCHES =====
export interface DistributionBatch {
  id: string;
  code: string;
  name: string;
  timing: string;
}

export const batches: DistributionBatch[] = [
  { id: "B1", code: "BT01", name: "Morning Batch", timing: "5:00 AM - 8:00 AM" },
  { id: "B2", code: "BT02", name: "Afternoon Batch", timing: "12:00 PM - 2:00 PM" },
  { id: "B3", code: "BT03", name: "Evening Batch", timing: "4:00 PM - 6:00 PM" },
];

// ===== INDENTS =====
export interface IndentItem {
  productId: string;
  quantity: number;
}

export interface Indent {
  id: string;
  customerId: string;
  batchId: string;
  routeId: string;
  date: string;
  items: IndentItem[];
  status: "Pending" | "Posted";
  agentCode: string;
}

export const indents: Indent[] = [
  { id: "IND1", customerId: "C1", batchId: "B1", routeId: "R1", date: "2026-04-08", items: [{ productId: "P1", quantity: 50 }, { productId: "P2", quantity: 30 }, { productId: "P3", quantity: 20 }], status: "Pending", agentCode: "AG01" },
  { id: "IND2", customerId: "C2", batchId: "B1", routeId: "R1", date: "2026-04-08", items: [{ productId: "P1", quantity: 20 }, { productId: "P3", quantity: 10 }], status: "Pending", agentCode: "AG01" },
  { id: "IND3", customerId: "C3", batchId: "B1", routeId: "R2", date: "2026-04-08", items: [{ productId: "P1", quantity: 40 }, { productId: "P2", quantity: 20 }, { productId: "P4", quantity: 60 }], status: "Posted", agentCode: "AG02" },
  { id: "IND4", customerId: "C4", batchId: "B2", routeId: "R2", date: "2026-04-08", items: [{ productId: "P1", quantity: 30 }, { productId: "P5", quantity: 48 }], status: "Pending", agentCode: "AG02" },
  { id: "IND5", customerId: "C5", batchId: "B1", routeId: "R3", date: "2026-04-08", items: [{ productId: "P1", quantity: 60 }, { productId: "P2", quantity: 40 }, { productId: "P3", quantity: 30 }, { productId: "P4", quantity: 90 }], status: "Posted", agentCode: "AG03" },
];

// ===== FGS STOCK =====
export interface StockEntry {
  id: string;
  productId: string;
  date: string;
  type: "Production" | "Dispatch" | "Wastage" | "Return" | "Adjustment";
  quantity: number;
  batchRef: string;
  notes: string;
}

export const stockEntries: StockEntry[] = [
  { id: "S1", productId: "P1", date: "2026-04-08", type: "Production", quantity: 500, batchRef: "PRD-0408-01", notes: "Morning production" },
  { id: "S2", productId: "P2", date: "2026-04-08", type: "Production", quantity: 300, batchRef: "PRD-0408-01", notes: "Morning production" },
  { id: "S3", productId: "P3", date: "2026-04-08", type: "Production", quantity: 200, batchRef: "PRD-0408-01", notes: "Morning production" },
  { id: "S4", productId: "P4", date: "2026-04-08", type: "Production", quantity: 400, batchRef: "PRD-0408-01", notes: "Morning production" },
  { id: "S5", productId: "P5", date: "2026-04-08", type: "Production", quantity: 250, batchRef: "PRD-0408-01", notes: "Morning production" },
  { id: "S6", productId: "P1", date: "2026-04-08", type: "Dispatch", quantity: -170, batchRef: "DSP-0408-01", notes: "Route R1+R2+R3 dispatch" },
  { id: "S7", productId: "P2", date: "2026-04-08", type: "Dispatch", quantity: -90, batchRef: "DSP-0408-01", notes: "Route R1+R2 dispatch" },
  { id: "S8", productId: "P3", date: "2026-04-08", type: "Dispatch", quantity: -60, batchRef: "DSP-0408-01", notes: "Route dispatch" },
  { id: "S9", productId: "P1", date: "2026-04-07", type: "Production", quantity: 480, batchRef: "PRD-0407-01", notes: "Morning production" },
  { id: "S10", productId: "P1", date: "2026-04-07", type: "Dispatch", quantity: -450, batchRef: "DSP-0407-01", notes: "Full day dispatch" },
  { id: "S11", productId: "P1", date: "2026-04-07", type: "Wastage", quantity: -5, batchRef: "", notes: "Damaged packets" },
];

// ===== RATE CATEGORIES =====
export const rateCategories = [
  "Retail-Dealer",
  "Credit Inst-MRP",
  "Credit Inst-Dealer",
  "Parlour-Dealer",
];

// ===== OFFICERS =====
export const officers = ["Ramesh K", "Suresh M", "Mahesh P", "Ganesh R"];

// ===== AGENTS =====
export const agents = [
  { code: "AG01", name: "Agent Ravi" },
  { code: "AG02", name: "Agent Kumar" },
  { code: "AG03", name: "Agent Prakash" },
  { code: "AG04", name: "Agent Sunil" },
];
