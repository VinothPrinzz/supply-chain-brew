import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(["Retail-Dealer", "Credit Inst-MRP", "Credit Inst-Dealer", "Parlour-Dealer"]),
  rateCategory: z.string().min(1, "Rate category required"),
  bank: z.string().optional(),
  payMode: z.enum(["Cash", "Credit"]),
  officerName: z.string().min(1, "Officer required"),
  phone: z.string().min(10, "Valid phone required"),
  city: z.string().min(1, "City required"),
  address: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export const contractorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  contact: z.string().min(10, "Valid contact required"),
  vehicleNo: z.string().min(4, "Vehicle number required"),
  address: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});

export type ContractorFormData = z.infer<typeof contractorSchema>;

export const routeSchema = z.object({
  code: z.string().min(2, "Code required"),
  name: z.string().min(2, "Name required"),
  taluka: z.string().min(1, "Taluka required"),
  contractorId: z.string().min(1, "Contractor required"),
  dispatchTime: z.string().min(1, "Dispatch time required"),
  description: z.string().optional(),
});

export type RouteFormData = z.infer<typeof routeSchema>;

export const batchSchema = z.object({
  code: z.string().min(2, "Code required"),
  whichBatch: z.string().min(1, "Select batch type"),
  timing: z.string(),
});

export type BatchFormData = z.infer<typeof batchSchema>;

export const productSchema = z.object({
  name: z.string().min(2, "Name required"),
  reportAlias: z.string().min(1, "Report alias required"),
  category: z.string().min(1, "Category required"),
  packSize: z.coerce.number().min(0),
  unit: z.enum(["kg", "ltr", "pcs"]),
  mrp: z.coerce.number().min(0),
  gstPercent: z.coerce.number().min(0),
  cgst: z.coerce.number().min(0),
  sgst: z.coerce.number().min(0),
  hsnNo: z.string(),
  subsidy: z.boolean().default(false),
  subRate: z.coerce.number().default(0),
  indentInBox: z.boolean().default(false),
  boxQty: z.coerce.number().default(0),
  sortPosition: z.coerce.number().default(0),
  makeZero: z.boolean().default(false),
  packetsPerCrate: z.coerce.number().default(0),
  printDirection: z.enum(["Across", "Down"]).default("Across"),
  terminated: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const bannerSchema = z.object({
  title: z.string().min(2, "Title required"),
  category: z.string().min(1, "Category required"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
});

export type BannerFormData = z.infer<typeof bannerSchema>;

export const authSchema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});

export type AuthFormData = z.infer<typeof authSchema>;
