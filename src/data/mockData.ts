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
  stock: number;
}

export const products: Product[] = [
  { id: "P1", code: "001", name: "Nandini Toned Milk 500ml", reportAlias: "TM 500", category: "Milk", packSize: 0.5, unit: "ltr", mrp: 24, gstPercent: 0, cgst: 0, sgst: 0, hsnNo: "0401", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 1, makeZero: false, packetsPerCrate: 20, printDirection: "Across", terminated: false, stock: 330, rateCategories: { "Retail-Dealer": 22.5, "Credit Inst-MRP": 24, "Credit Inst-Dealer": 22.5, "Parlour-Dealer": 22 } },
  { id: "P2", code: "002", name: "Nandini Full Cream Milk 500ml", reportAlias: "FCM 500", category: "Milk", packSize: 0.5, unit: "ltr", mrp: 30, gstPercent: 0, cgst: 0, sgst: 0, hsnNo: "0401", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 2, makeZero: false, packetsPerCrate: 20, printDirection: "Across", terminated: false, stock: 210, rateCategories: { "Retail-Dealer": 28, "Credit Inst-MRP": 30, "Credit Inst-Dealer": 28, "Parlour-Dealer": 27.5 } },
  { id: "P3", code: "003", name: "Nandini Curd 500ml", reportAlias: "Curd 500", category: "Curd", packSize: 0.5, unit: "kg", mrp: 30, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "0403", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 3, makeZero: false, packetsPerCrate: 12, printDirection: "Across", terminated: false, stock: 140, rateCategories: { "Retail-Dealer": 28, "Credit Inst-MRP": 30, "Credit Inst-Dealer": 28, "Parlour-Dealer": 27 } },
  { id: "P4", code: "004", name: "Nandini Buttermilk 200ml", reportAlias: "BM 200", category: "Buttermilk", packSize: 0.2, unit: "ltr", mrp: 10, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0403", subsidy: false, subRate: 0, indentInBox: true, boxQty: 30, sortPosition: 4, makeZero: false, packetsPerCrate: 30, printDirection: "Across", terminated: false, stock: 400, rateCategories: { "Retail-Dealer": 9, "Credit Inst-MRP": 10, "Credit Inst-Dealer": 9, "Parlour-Dealer": 8.5 } },
  { id: "P5", code: "005", name: "Nandini Lassi 200ml", reportAlias: "Lassi 200", category: "Lassi", packSize: 0.2, unit: "ltr", mrp: 15, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0403", subsidy: false, subRate: 0, indentInBox: true, boxQty: 24, sortPosition: 5, makeZero: false, packetsPerCrate: 24, printDirection: "Down", terminated: false, stock: 250, rateCategories: { "Retail-Dealer": 13.5, "Credit Inst-MRP": 15, "Credit Inst-Dealer": 13.5, "Parlour-Dealer": 13 } },
  { id: "P6", code: "006", name: "Nandini Ghee 500ml", reportAlias: "Ghee 500", category: "Ghee", packSize: 0.5, unit: "ltr", mrp: 275, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0405", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 6, makeZero: false, packetsPerCrate: 12, printDirection: "Down", terminated: false, stock: 45, rateCategories: { "Retail-Dealer": 260, "Credit Inst-MRP": 275, "Credit Inst-Dealer": 260, "Parlour-Dealer": 255 } },
  { id: "P7", code: "007", name: "Nandini Peda 250g", reportAlias: "Peda 250", category: "Sweets", packSize: 0.25, unit: "kg", mrp: 120, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "1704", subsidy: false, subRate: 0, indentInBox: true, boxQty: 20, sortPosition: 7, makeZero: true, packetsPerCrate: 20, printDirection: "Down", terminated: false, stock: 0, rateCategories: { "Retail-Dealer": 112, "Credit Inst-MRP": 120, "Credit Inst-Dealer": 112, "Parlour-Dealer": 110 } },
  { id: "P8", code: "008", name: "Nandini Paneer 200g", reportAlias: "Paneer 200", category: "Paneer", packSize: 0.2, unit: "kg", mrp: 90, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "0406", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 8, makeZero: true, packetsPerCrate: 15, printDirection: "Down", terminated: false, stock: 30, rateCategories: { "Retail-Dealer": 84, "Credit Inst-MRP": 90, "Credit Inst-Dealer": 84, "Parlour-Dealer": 82 } },
  { id: "P9", code: "009", name: "Nandini Toned Milk 1L", reportAlias: "TM 1L", category: "Milk", packSize: 1, unit: "ltr", mrp: 48, gstPercent: 0, cgst: 0, sgst: 0, hsnNo: "0401", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 9, makeZero: false, packetsPerCrate: 12, printDirection: "Across", terminated: false, stock: 220, rateCategories: { "Retail-Dealer": 45, "Credit Inst-MRP": 48, "Credit Inst-Dealer": 45, "Parlour-Dealer": 44 } },
  { id: "P10", code: "010", name: "Nandini Full Cream Milk 1L", reportAlias: "FCM 1L", category: "Milk", packSize: 1, unit: "ltr", mrp: 60, gstPercent: 0, cgst: 0, sgst: 0, hsnNo: "0401", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 10, makeZero: false, packetsPerCrate: 12, printDirection: "Across", terminated: false, stock: 180, rateCategories: { "Retail-Dealer": 56, "Credit Inst-MRP": 60, "Credit Inst-Dealer": 56, "Parlour-Dealer": 55 } },
  { id: "P11", code: "011", name: "Nandini Standardized Milk 500ml", reportAlias: "STM 500", category: "Milk", packSize: 0.5, unit: "ltr", mrp: 26, gstPercent: 0, cgst: 0, sgst: 0, hsnNo: "0401", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 11, makeZero: false, packetsPerCrate: 20, printDirection: "Across", terminated: false, stock: 260, rateCategories: { "Retail-Dealer": 24, "Credit Inst-MRP": 26, "Credit Inst-Dealer": 24, "Parlour-Dealer": 23.5 } },
  { id: "P12", code: "012", name: "Nandini Double Toned Milk 500ml", reportAlias: "DTM 500", category: "Milk", packSize: 0.5, unit: "ltr", mrp: 22, gstPercent: 0, cgst: 0, sgst: 0, hsnNo: "0401", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 12, makeZero: false, packetsPerCrate: 20, printDirection: "Across", terminated: false, stock: 200, rateCategories: { "Retail-Dealer": 20, "Credit Inst-MRP": 22, "Credit Inst-Dealer": 20, "Parlour-Dealer": 19.5 } },
  { id: "P13", code: "013", name: "Nandini Smart Milk 500ml", reportAlias: "Smart 500", category: "Milk", packSize: 0.5, unit: "ltr", mrp: 28, gstPercent: 0, cgst: 0, sgst: 0, hsnNo: "0401", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 13, makeZero: false, packetsPerCrate: 20, printDirection: "Across", terminated: false, stock: 150, rateCategories: { "Retail-Dealer": 26, "Credit Inst-MRP": 28, "Credit Inst-Dealer": 26, "Parlour-Dealer": 25.5 } },
  { id: "P14", code: "014", name: "Nandini Special Milk 500ml", reportAlias: "Spl 500", category: "Milk", packSize: 0.5, unit: "ltr", mrp: 32, gstPercent: 0, cgst: 0, sgst: 0, hsnNo: "0401", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 14, makeZero: false, packetsPerCrate: 20, printDirection: "Across", terminated: false, stock: 140, rateCategories: { "Retail-Dealer": 30, "Credit Inst-MRP": 32, "Credit Inst-Dealer": 30, "Parlour-Dealer": 29 } },
  { id: "P15", code: "015", name: "Nandini Cow Milk 500ml", reportAlias: "Cow 500", category: "Milk", packSize: 0.5, unit: "ltr", mrp: 27, gstPercent: 0, cgst: 0, sgst: 0, hsnNo: "0401", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 15, makeZero: false, packetsPerCrate: 20, printDirection: "Across", terminated: false, stock: 175, rateCategories: { "Retail-Dealer": 25, "Credit Inst-MRP": 27, "Credit Inst-Dealer": 25, "Parlour-Dealer": 24.5 } },
  { id: "P16", code: "016", name: "Nandini Curd 200ml", reportAlias: "Curd 200", category: "Curd", packSize: 0.2, unit: "kg", mrp: 14, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "0403", subsidy: false, subRate: 0, indentInBox: true, boxQty: 30, sortPosition: 16, makeZero: false, packetsPerCrate: 30, printDirection: "Across", terminated: false, stock: 320, rateCategories: { "Retail-Dealer": 13, "Credit Inst-MRP": 14, "Credit Inst-Dealer": 13, "Parlour-Dealer": 12.5 } },
  { id: "P17", code: "017", name: "Nandini Curd 1Kg", reportAlias: "Curd 1K", category: "Curd", packSize: 1, unit: "kg", mrp: 60, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "0403", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 17, makeZero: false, packetsPerCrate: 8, printDirection: "Across", terminated: false, stock: 90, rateCategories: { "Retail-Dealer": 56, "Credit Inst-MRP": 60, "Credit Inst-Dealer": 56, "Parlour-Dealer": 54 } },
  { id: "P18", code: "018", name: "Nandini Set Curd 400g", reportAlias: "SetC 400", category: "Curd", packSize: 0.4, unit: "kg", mrp: 28, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "0403", subsidy: false, subRate: 0, indentInBox: true, boxQty: 16, sortPosition: 18, makeZero: false, packetsPerCrate: 16, printDirection: "Across", terminated: false, stock: 130, rateCategories: { "Retail-Dealer": 26, "Credit Inst-MRP": 28, "Credit Inst-Dealer": 26, "Parlour-Dealer": 25 } },
  { id: "P19", code: "019", name: "Nandini Buttermilk 500ml", reportAlias: "BM 500", category: "Buttermilk", packSize: 0.5, unit: "ltr", mrp: 18, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0403", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 19, makeZero: false, packetsPerCrate: 20, printDirection: "Across", terminated: false, stock: 240, rateCategories: { "Retail-Dealer": 16, "Credit Inst-MRP": 18, "Credit Inst-Dealer": 16, "Parlour-Dealer": 15.5 } },
  { id: "P20", code: "020", name: "Nandini Spiced Buttermilk 200ml", reportAlias: "SpcBM 200", category: "Buttermilk", packSize: 0.2, unit: "ltr", mrp: 12, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0403", subsidy: false, subRate: 0, indentInBox: true, boxQty: 30, sortPosition: 20, makeZero: false, packetsPerCrate: 30, printDirection: "Across", terminated: false, stock: 350, rateCategories: { "Retail-Dealer": 11, "Credit Inst-MRP": 12, "Credit Inst-Dealer": 11, "Parlour-Dealer": 10.5 } },
  { id: "P21", code: "021", name: "Nandini Lassi 500ml", reportAlias: "Lassi 500", category: "Lassi", packSize: 0.5, unit: "ltr", mrp: 35, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0403", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 21, makeZero: false, packetsPerCrate: 12, printDirection: "Down", terminated: false, stock: 130, rateCategories: { "Retail-Dealer": 32, "Credit Inst-MRP": 35, "Credit Inst-Dealer": 32, "Parlour-Dealer": 31 } },
  { id: "P22", code: "022", name: "Nandini Mango Lassi 200ml", reportAlias: "MgLassi", category: "Lassi", packSize: 0.2, unit: "ltr", mrp: 18, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0403", subsidy: false, subRate: 0, indentInBox: true, boxQty: 24, sortPosition: 22, makeZero: false, packetsPerCrate: 24, printDirection: "Down", terminated: false, stock: 200, rateCategories: { "Retail-Dealer": 16.5, "Credit Inst-MRP": 18, "Credit Inst-Dealer": 16.5, "Parlour-Dealer": 16 } },
  { id: "P23", code: "023", name: "Nandini Ghee 1L", reportAlias: "Ghee 1L", category: "Ghee", packSize: 1, unit: "ltr", mrp: 540, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0405", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 23, makeZero: false, packetsPerCrate: 6, printDirection: "Down", terminated: false, stock: 30, rateCategories: { "Retail-Dealer": 510, "Credit Inst-MRP": 540, "Credit Inst-Dealer": 510, "Parlour-Dealer": 500 } },
  { id: "P24", code: "024", name: "Nandini Ghee 200ml", reportAlias: "Ghee 200", category: "Ghee", packSize: 0.2, unit: "ltr", mrp: 115, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0405", subsidy: false, subRate: 0, indentInBox: true, boxQty: 24, sortPosition: 24, makeZero: false, packetsPerCrate: 24, printDirection: "Down", terminated: false, stock: 70, rateCategories: { "Retail-Dealer": 108, "Credit Inst-MRP": 115, "Credit Inst-Dealer": 108, "Parlour-Dealer": 105 } },
  { id: "P25", code: "025", name: "Nandini Butter 100g", reportAlias: "Butr 100", category: "Butter", packSize: 0.1, unit: "kg", mrp: 55, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0405", subsidy: false, subRate: 0, indentInBox: true, boxQty: 30, sortPosition: 25, makeZero: false, packetsPerCrate: 30, printDirection: "Down", terminated: false, stock: 110, rateCategories: { "Retail-Dealer": 51, "Credit Inst-MRP": 55, "Credit Inst-Dealer": 51, "Parlour-Dealer": 50 } },
  { id: "P26", code: "026", name: "Nandini Butter 500g", reportAlias: "Butr 500", category: "Butter", packSize: 0.5, unit: "kg", mrp: 260, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0405", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 26, makeZero: false, packetsPerCrate: 12, printDirection: "Down", terminated: false, stock: 40, rateCategories: { "Retail-Dealer": 245, "Credit Inst-MRP": 260, "Credit Inst-Dealer": 245, "Parlour-Dealer": 240 } },
  { id: "P27", code: "027", name: "Nandini Paneer 1Kg", reportAlias: "Pnr 1K", category: "Paneer", packSize: 1, unit: "kg", mrp: 420, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "0406", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 27, makeZero: false, packetsPerCrate: 6, printDirection: "Down", terminated: false, stock: 25, rateCategories: { "Retail-Dealer": 395, "Credit Inst-MRP": 420, "Credit Inst-Dealer": 395, "Parlour-Dealer": 385 } },
  { id: "P28", code: "028", name: "Nandini Cheese Slices 200g", reportAlias: "Chse 200", category: "Cheese", packSize: 0.2, unit: "kg", mrp: 130, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0406", subsidy: false, subRate: 0, indentInBox: true, boxQty: 20, sortPosition: 28, makeZero: false, packetsPerCrate: 20, printDirection: "Down", terminated: false, stock: 60, rateCategories: { "Retail-Dealer": 122, "Credit Inst-MRP": 130, "Credit Inst-Dealer": 122, "Parlour-Dealer": 118 } },
  { id: "P29", code: "029", name: "Nandini Khova 250g", reportAlias: "Khova 250", category: "Sweets", packSize: 0.25, unit: "kg", mrp: 150, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "0406", subsidy: false, subRate: 0, indentInBox: true, boxQty: 16, sortPosition: 29, makeZero: false, packetsPerCrate: 16, printDirection: "Down", terminated: false, stock: 35, rateCategories: { "Retail-Dealer": 140, "Credit Inst-MRP": 150, "Credit Inst-Dealer": 140, "Parlour-Dealer": 138 } },
  { id: "P30", code: "030", name: "Nandini Mysore Pak 250g", reportAlias: "MysrPak", category: "Sweets", packSize: 0.25, unit: "kg", mrp: 140, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "1704", subsidy: false, subRate: 0, indentInBox: true, boxQty: 16, sortPosition: 30, makeZero: false, packetsPerCrate: 16, printDirection: "Down", terminated: false, stock: 45, rateCategories: { "Retail-Dealer": 130, "Credit Inst-MRP": 140, "Credit Inst-Dealer": 130, "Parlour-Dealer": 128 } },
  { id: "P31", code: "031", name: "Nandini Jamoon 1Kg", reportAlias: "Jamoon 1K", category: "Sweets", packSize: 1, unit: "kg", mrp: 220, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "1704", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 31, makeZero: false, packetsPerCrate: 6, printDirection: "Down", terminated: false, stock: 30, rateCategories: { "Retail-Dealer": 205, "Credit Inst-MRP": 220, "Credit Inst-Dealer": 205, "Parlour-Dealer": 200 } },
  { id: "P32", code: "032", name: "Nandini Burfi 250g", reportAlias: "Burfi 250", category: "Sweets", packSize: 0.25, unit: "kg", mrp: 135, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "1704", subsidy: false, subRate: 0, indentInBox: true, boxQty: 20, sortPosition: 32, makeZero: false, packetsPerCrate: 20, printDirection: "Down", terminated: false, stock: 40, rateCategories: { "Retail-Dealer": 126, "Credit Inst-MRP": 135, "Credit Inst-Dealer": 126, "Parlour-Dealer": 122 } },
  { id: "P33", code: "033", name: "Nandini Choco Milk 200ml", reportAlias: "Choco 200", category: "FlavMilk", packSize: 0.2, unit: "ltr", mrp: 25, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0402", subsidy: false, subRate: 0, indentInBox: true, boxQty: 27, sortPosition: 33, makeZero: false, packetsPerCrate: 27, printDirection: "Down", terminated: false, stock: 180, rateCategories: { "Retail-Dealer": 23, "Credit Inst-MRP": 25, "Credit Inst-Dealer": 23, "Parlour-Dealer": 22 } },
  { id: "P34", code: "034", name: "Nandini Badam Milk 200ml", reportAlias: "Bdam 200", category: "FlavMilk", packSize: 0.2, unit: "ltr", mrp: 30, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0402", subsidy: false, subRate: 0, indentInBox: true, boxQty: 27, sortPosition: 34, makeZero: false, packetsPerCrate: 27, printDirection: "Down", terminated: false, stock: 160, rateCategories: { "Retail-Dealer": 28, "Credit Inst-MRP": 30, "Credit Inst-Dealer": 28, "Parlour-Dealer": 27 } },
  { id: "P35", code: "035", name: "Nandini Rose Milk 200ml", reportAlias: "Rose 200", category: "FlavMilk", packSize: 0.2, unit: "ltr", mrp: 25, gstPercent: 12, cgst: 6, sgst: 6, hsnNo: "0402", subsidy: false, subRate: 0, indentInBox: true, boxQty: 27, sortPosition: 35, makeZero: false, packetsPerCrate: 27, printDirection: "Down", terminated: false, stock: 140, rateCategories: { "Retail-Dealer": 23, "Credit Inst-MRP": 25, "Credit Inst-Dealer": 23, "Parlour-Dealer": 22 } },
  { id: "P36", code: "036", name: "Nandini Ice Cream Vanilla 500ml", reportAlias: "IC Van", category: "IceCream", packSize: 0.5, unit: "ltr", mrp: 150, gstPercent: 18, cgst: 9, sgst: 9, hsnNo: "2105", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 36, makeZero: false, packetsPerCrate: 8, printDirection: "Down", terminated: false, stock: 50, rateCategories: { "Retail-Dealer": 140, "Credit Inst-MRP": 150, "Credit Inst-Dealer": 140, "Parlour-Dealer": 135 } },
  { id: "P37", code: "037", name: "Nandini SMP 1Kg", reportAlias: "SMP 1K", category: "Powder", packSize: 1, unit: "kg", mrp: 480, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "0402", subsidy: false, subRate: 0, indentInBox: false, boxQty: 0, sortPosition: 37, makeZero: false, packetsPerCrate: 6, printDirection: "Down", terminated: false, stock: 25, rateCategories: { "Retail-Dealer": 450, "Credit Inst-MRP": 480, "Credit Inst-Dealer": 450, "Parlour-Dealer": 440 } },
  { id: "P38", code: "038", name: "Nandini WMP 500g", reportAlias: "WMP 500", category: "Powder", packSize: 0.5, unit: "kg", mrp: 280, gstPercent: 5, cgst: 2.5, sgst: 2.5, hsnNo: "0402", subsidy: false, subRate: 0, indentInBox: true, boxQty: 12, sortPosition: 38, makeZero: false, packetsPerCrate: 12, printDirection: "Down", terminated: false, stock: 35, rateCategories: { "Retail-Dealer": 263, "Credit Inst-MRP": 280, "Credit Inst-Dealer": 263, "Parlour-Dealer": 258 } },
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
  creditBalance: number;
}

export const customers: Customer[] = [
  { id: "C1", code: "A1", name: "Sri Lakshmi Dairy", type: "Retail-Dealer", rateCategory: "Retail-Dealer", bank: "SBI", payMode: "Cash", officerName: "Ramesh K", address: "Main Road, Haveri", city: "Haveri", phone: "9876543210", status: "Active", routeId: "R1", creditBalance: 5000 },
  { id: "C2", code: "A2", name: "Govt. Hospital Haveri", type: "Credit Inst-MRP", rateCategory: "Credit Inst-MRP", bank: "Canara Bank", payMode: "Credit", officerName: "Suresh M", address: "Hospital Road", city: "Haveri", phone: "9876543211", status: "Active", routeId: "R1", creditBalance: 25000 },
  { id: "C3", code: "A3", name: "Hotel Sagar", type: "Credit Inst-Dealer", rateCategory: "Credit Inst-Dealer", bank: "SBI", payMode: "Credit", officerName: "Ramesh K", address: "Station Road", city: "Haveri", phone: "9876543212", status: "Active", routeId: "R2", creditBalance: 15000 },
  { id: "C4", code: "A4", name: "Nandini Parlour MG Road", type: "Parlour-Dealer", rateCategory: "Parlour-Dealer", bank: "BOB", payMode: "Cash", officerName: "Mahesh P", address: "MG Road", city: "Haveri", phone: "9876543213", status: "Active", routeId: "R2", creditBalance: 3000 },
  { id: "C5", code: "A5", name: "Maruthi Stores", type: "Retail-Dealer", rateCategory: "Retail-Dealer", bank: "SBI", payMode: "Cash", officerName: "Suresh M", address: "Market Road", city: "Ranebennur", phone: "9876543214", status: "Active", routeId: "R3", creditBalance: 8000 },
  { id: "C6", code: "A6", name: "KMF Parlour Bus Stand", type: "Parlour-Dealer", rateCategory: "Parlour-Dealer", bank: "SBI", payMode: "Cash", officerName: "Mahesh P", address: "Bus Stand", city: "Haveri", phone: "9876543215", status: "Active", routeId: "R1", creditBalance: 4000 },
  { id: "C7", code: "A7", name: "District School", type: "Credit Inst-MRP", rateCategory: "Credit Inst-MRP", bank: "PNB", payMode: "Credit", officerName: "Ramesh K", address: "School Road", city: "Byadgi", phone: "9876543216", status: "Inactive", routeId: "R4", creditBalance: 10000 },
  { id: "C8", code: "A8", name: "New Fresh Dairy", type: "Retail-Dealer", rateCategory: "Retail-Dealer", bank: "SBI", payMode: "Cash", officerName: "Suresh M", address: "Gandhi Nagar", city: "Savanur", phone: "9876543217", status: "Active", routeId: "R5", creditBalance: 6000 },
];

// ===== ROUTES =====
export interface Route {
  id: string;
  code: string;
  name: string;
  taluka: string;
  contractorId: string;
  dispatchTime: string;
  status: "Active" | "Inactive";
  description: string;
}

export const routes: Route[] = [
  { id: "R1", code: "RT01", name: "Haveri City Route 1", taluka: "Haveri", contractorId: "CT1", dispatchTime: "5:30 AM", status: "Active", description: "Main city route covering MG Road, Station Road, Hospital Road" },
  { id: "R2", code: "RT02", name: "Haveri City Route 2", taluka: "Haveri", contractorId: "CT1", dispatchTime: "5:30 AM", status: "Active", description: "City route covering Market Area, Gandhi Nagar" },
  { id: "R3", code: "RT03", name: "Ranebennur Route", taluka: "Ranebennur", contractorId: "CT2", dispatchTime: "6:00 AM", status: "Active", description: "Ranebennur town delivery route" },
  { id: "R4", code: "RT04", name: "Byadgi Route", taluka: "Byadgi", contractorId: "CT2", dispatchTime: "6:30 AM", status: "Active", description: "Byadgi town delivery" },
  { id: "R5", code: "RT05", name: "Savanur Route", taluka: "Savanur", contractorId: "CT3", dispatchTime: "6:00 AM", status: "Active", description: "Savanur area delivery" },
  { id: "R6", code: "RT06", name: "Hirekerur Route", taluka: "Hirekerur", contractorId: "CT3", dispatchTime: "7:00 AM", status: "Inactive", description: "Hirekerur town delivery" },
];

// ===== CONTRACTORS =====
export interface Contractor {
  id: string;
  name: string;
  contact: string;
  address: string;
  vehicleNo: string;
  status: "Active" | "Inactive";
  assignedRouteIds: string[];
}

export const contractors: Contractor[] = [
  { id: "CT1", name: "Karnataka Transport Co.", contact: "9876500001", address: "Industrial Area, Haveri", vehicleNo: "KA-25-AB-1234", status: "Active", assignedRouteIds: ["R1", "R2"] },
  { id: "CT2", name: "Sree Logistics", contact: "9876500002", address: "NH-4 Highway, Haveri", vehicleNo: "KA-25-CD-5678", status: "Active", assignedRouteIds: ["R3", "R4"] },
  { id: "CT3", name: "Raghavendra Transports", contact: "9876500003", address: "Station Road, Ranebennur", vehicleNo: "KA-25-EF-9012", status: "Inactive", assignedRouteIds: ["R5", "R6"] },
];

// ===== DISTRIBUTION BATCHES =====
export interface DistributionBatch {
  id: string;
  code: string;
  name: string;
  whichBatch: string;
  timing: string;
  routeIds: string[];
  status: "Active" | "Inactive";
}

export const batches: DistributionBatch[] = [
  { id: "B1", code: "BT01", name: "Morning Batch", whichBatch: "Morning", timing: "5:00 AM - 8:00 AM", routeIds: ["R1", "R2", "R3", "R4"], status: "Active" },
  { id: "B2", code: "BT02", name: "Afternoon Batch", whichBatch: "Afternoon", timing: "12:00 PM - 2:00 PM", routeIds: ["R2", "R5"], status: "Active" },
  { id: "B3", code: "BT03", name: "Evening Batch", whichBatch: "Evening", timing: "4:00 PM - 6:00 PM", routeIds: ["R1", "R6"], status: "Active" },
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
  totalAmount: number;
  gstAmount: number;
}

export const indents: Indent[] = [
  { id: "IND001", customerId: "C1", batchId: "B1", routeId: "R1", date: "2026-04-08", items: [{ productId: "P1", quantity: 50 }, { productId: "P2", quantity: 30 }, { productId: "P3", quantity: 20 }], status: "Pending", agentCode: "AG01", totalAmount: 2505, gstAmount: 30 },
  { id: "IND002", customerId: "C2", batchId: "B1", routeId: "R1", date: "2026-04-08", items: [{ productId: "P1", quantity: 20 }, { productId: "P3", quantity: 10 }], status: "Pending", agentCode: "AG01", totalAmount: 780, gstAmount: 15 },
  { id: "IND003", customerId: "C3", batchId: "B1", routeId: "R2", date: "2026-04-08", items: [{ productId: "P1", quantity: 40 }, { productId: "P2", quantity: 20 }, { productId: "P4", quantity: 60 }], status: "Posted", agentCode: "AG02", totalAmount: 2000, gstAmount: 65 },
  { id: "IND004", customerId: "C4", batchId: "B2", routeId: "R2", date: "2026-04-08", items: [{ productId: "P1", quantity: 30 }, { productId: "P5", quantity: 48 }], status: "Pending", agentCode: "AG02", totalAmount: 1323, gstAmount: 78 },
  { id: "IND005", customerId: "C5", batchId: "B1", routeId: "R3", date: "2026-04-08", items: [{ productId: "P1", quantity: 60 }, { productId: "P2", quantity: 40 }, { productId: "P3", quantity: 30 }, { productId: "P4", quantity: 90 }], status: "Posted", agentCode: "AG03", totalAmount: 3780, gstAmount: 132 },
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
  modifiedBy: string;
}

export const stockEntries: StockEntry[] = [
  { id: "S1", productId: "P1", date: "2026-04-08", type: "Production", quantity: 500, batchRef: "PRD-0408-01", notes: "Morning production", modifiedBy: "Admin" },
  { id: "S2", productId: "P2", date: "2026-04-08", type: "Production", quantity: 300, batchRef: "PRD-0408-01", notes: "Morning production", modifiedBy: "Admin" },
  { id: "S3", productId: "P3", date: "2026-04-08", type: "Production", quantity: 200, batchRef: "PRD-0408-01", notes: "Morning production", modifiedBy: "FGS Team" },
  { id: "S4", productId: "P4", date: "2026-04-08", type: "Production", quantity: 400, batchRef: "PRD-0408-01", notes: "Morning production", modifiedBy: "FGS Team" },
  { id: "S5", productId: "P5", date: "2026-04-08", type: "Production", quantity: 250, batchRef: "PRD-0408-01", notes: "Morning production", modifiedBy: "Admin" },
  { id: "S6", productId: "P1", date: "2026-04-08", type: "Dispatch", quantity: -170, batchRef: "DSP-0408-01", notes: "Route R1+R2+R3 dispatch", modifiedBy: "Admin" },
  { id: "S7", productId: "P2", date: "2026-04-08", type: "Dispatch", quantity: -90, batchRef: "DSP-0408-01", notes: "Route R1+R2 dispatch", modifiedBy: "Admin" },
  { id: "S8", productId: "P3", date: "2026-04-08", type: "Dispatch", quantity: -60, batchRef: "DSP-0408-01", notes: "Route dispatch", modifiedBy: "FGS Team" },
  { id: "S9", productId: "P1", date: "2026-04-07", type: "Production", quantity: 480, batchRef: "PRD-0407-01", notes: "Morning production", modifiedBy: "Admin" },
  { id: "S10", productId: "P1", date: "2026-04-07", type: "Dispatch", quantity: -450, batchRef: "DSP-0407-01", notes: "Full day dispatch", modifiedBy: "Admin" },
  { id: "S11", productId: "P1", date: "2026-04-07", type: "Wastage", quantity: -5, batchRef: "", notes: "Damaged packets", modifiedBy: "FGS Team" },
];

// ===== CANCELLATION REQUESTS =====
export interface CancellationRequest {
  id: string;
  indentId: string;
  customerId: string;
  agentCode: string;
  routeId: string;
  items: IndentItem[];
  totalAmount: number;
  requestTime: string;
  type: "Cancel" | "Modify";
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  rejectionReason: string;
}

export const cancellationRequests: CancellationRequest[] = [
  { id: "CR1", indentId: "IND001", customerId: "C1", agentCode: "AG01", routeId: "R1", items: [{ productId: "P1", quantity: 50 }, { productId: "P2", quantity: 30 }], totalAmount: 1965, requestTime: "2026-04-08 06:30 AM", type: "Modify", reason: "Reduce TM 500 quantity to 30", status: "Pending", rejectionReason: "" },
  { id: "CR2", indentId: "IND004", customerId: "C4", agentCode: "AG02", routeId: "R2", items: [{ productId: "P1", quantity: 30 }, { productId: "P5", quantity: 48 }], totalAmount: 1323, requestTime: "2026-04-08 07:15 AM", type: "Cancel", reason: "Shop closed today", status: "Pending", rejectionReason: "" },
  { id: "CR3", indentId: "IND003", customerId: "C3", agentCode: "AG02", routeId: "R2", items: [{ productId: "P1", quantity: 40 }], totalAmount: 900, requestTime: "2026-04-07 08:00 AM", type: "Cancel", reason: "Duplicate order", status: "Approved", rejectionReason: "" },
  { id: "CR4", indentId: "IND005", customerId: "C5", agentCode: "AG03", routeId: "R3", items: [{ productId: "P4", quantity: 90 }], totalAmount: 810, requestTime: "2026-04-07 06:45 AM", type: "Modify", reason: "Wrong product selected", status: "Rejected", rejectionReason: "Already dispatched" },
];

// ===== DISPATCH ENTRIES =====
export interface DispatchEntry {
  id: string;
  routeId: string;
  date: string;
  totalIndents: number;
  totalCrates: number;
  totalAmount: number;
  dispatchTime: string;
  status: "Pending" | "Dispatched";
}

export const dispatchEntries: DispatchEntry[] = [
  { id: "D1", routeId: "R1", date: "2026-04-08", totalIndents: 3, totalCrates: 12, totalAmount: 4285, dispatchTime: "5:30 AM", status: "Dispatched" },
  { id: "D2", routeId: "R2", date: "2026-04-08", totalIndents: 2, totalCrates: 8, totalAmount: 3323, dispatchTime: "5:30 AM", status: "Pending" },
  { id: "D3", routeId: "R3", date: "2026-04-08", totalIndents: 1, totalCrates: 15, totalAmount: 3780, dispatchTime: "6:00 AM", status: "Dispatched" },
  { id: "D4", routeId: "R4", date: "2026-04-08", totalIndents: 0, totalCrates: 0, totalAmount: 0, dispatchTime: "6:30 AM", status: "Pending" },
  { id: "D5", routeId: "R5", date: "2026-04-08", totalIndents: 1, totalCrates: 5, totalAmount: 1800, dispatchTime: "6:00 AM", status: "Pending" },
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

// ===== SYSTEM SETTINGS =====
export interface TimeWindow {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  status: "Active" | "Inactive";
}

export const timeWindows: TimeWindow[] = [
  { id: "TW1", name: "Morning Indent Window", description: "Time window for morning indent placement", startTime: "04:00 AM", endTime: "06:00 AM", status: "Active" },
  { id: "TW2", name: "Afternoon Indent Window", description: "Time window for afternoon indent placement", startTime: "10:00 AM", endTime: "11:30 AM", status: "Active" },
  { id: "TW3", name: "Evening Indent Window", description: "Time window for evening indent placement", startTime: "02:00 PM", endTime: "03:30 PM", status: "Active" },
  { id: "TW4", name: "Cancellation Window", description: "Time window for cancellation/modification requests", startTime: "04:00 AM", endTime: "05:30 AM", status: "Active" },
];

export interface NotificationSetting {
  id: string;
  type: string;
  description: string;
  sendToAdmin: boolean;
  sendToDealer: boolean;
  sendToContractor: boolean;
  enabled: boolean;
}

export const notificationSettings: NotificationSetting[] = [
  { id: "NS1", type: "Indent Placed", description: "When a dealer places an indent", sendToAdmin: true, sendToDealer: true, sendToContractor: false, enabled: true },
  { id: "NS2", type: "Indent Posted", description: "When indents are posted for dispatch", sendToAdmin: true, sendToDealer: true, sendToContractor: true, enabled: true },
  { id: "NS3", type: "Cancellation Request", description: "When a dealer requests cancellation", sendToAdmin: true, sendToDealer: false, sendToContractor: false, enabled: true },
  { id: "NS4", type: "Low Stock Alert", description: "When product stock falls below threshold", sendToAdmin: true, sendToDealer: false, sendToContractor: false, enabled: true },
  { id: "NS5", type: "Dispatch Complete", description: "When dispatch is completed for a route", sendToAdmin: false, sendToDealer: true, sendToContractor: true, enabled: false },
];

export interface Banner {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  linkUrl: string;
  status: "Active" | "Inactive";
  startDate: string;
  endDate: string;
}

export const banners: Banner[] = [
  { id: "BN1", title: "Summer Special Offer", category: "Sales", imageUrl: "/placeholder.svg", linkUrl: "#", status: "Active", startDate: "2026-04-01", endDate: "2026-04-30" },
  { id: "BN2", title: "New Product Launch - Mango Lassi", category: "New Launch", imageUrl: "/placeholder.svg", linkUrl: "#", status: "Active", startDate: "2026-04-05", endDate: "2026-05-05" },
  { id: "BN3", title: "Festival Discount", category: "Festival", imageUrl: "/placeholder.svg", linkUrl: "#", status: "Inactive", startDate: "2026-03-15", endDate: "2026-03-31" },
];

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Operator" | "Viewer";
  status: "Active" | "Inactive";
  lastLogin: string;
}

export const systemUsers: SystemUser[] = [
  { id: "U1", name: "Admin User", email: "admin@haveridairy.com", role: "Admin", status: "Active", lastLogin: "2026-04-08 08:30 AM" },
  { id: "U2", name: "Ramesh K", email: "ramesh@haveridairy.com", role: "Manager", status: "Active", lastLogin: "2026-04-08 07:15 AM" },
  { id: "U3", name: "Suresh M", email: "suresh@haveridairy.com", role: "Operator", status: "Active", lastLogin: "2026-04-07 06:00 PM" },
  { id: "U4", name: "Mahesh P", email: "mahesh@haveridairy.com", role: "Operator", status: "Active", lastLogin: "2026-04-08 05:00 AM" },
  { id: "U5", name: "Viewer Account", email: "viewer@haveridairy.com", role: "Viewer", status: "Inactive", lastLogin: "2026-03-20 10:00 AM" },
];

export const roles = [
  { role: "Admin", permissions: ["All access", "System settings", "User management", "Reports", "Masters", "Sales", "FGS"] },
  { role: "Manager", permissions: ["Reports", "Masters", "Sales", "FGS", "View settings"] },
  { role: "Operator", permissions: ["Record indents", "Stock entry", "View reports"] },
  { role: "Viewer", permissions: ["View reports", "View dashboard"] },
];

// ===== PRICE REVISIONS =====
export type PriceRevisionField = "MRP" | "RateCategory" | "GST";
export interface PriceRevision {
  id: string;
  productId: string;
  field: PriceRevisionField;
  rateCategory?: string; // when field === "RateCategory"
  oldValue: number;
  newValue: number;
  effectiveFrom: string; // ISO date-time
  effectiveUntil?: string;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export const priceRevisions: PriceRevision[] = [
  { id: "PR1", productId: "P1", field: "MRP", oldValue: 22, newValue: 24, effectiveFrom: "2026-03-01T00:00", reason: "Annual revision", createdBy: "Admin User", createdAt: "2026-02-25T10:00" },
  { id: "PR2", productId: "P5", field: "GST", oldValue: 5, newValue: 12, effectiveFrom: "2026-04-15T00:00", reason: "Tax slab change", createdBy: "Admin User", createdAt: "2026-04-08T11:00" },
  { id: "PR3", productId: "P3", field: "RateCategory", rateCategory: "Retail-Dealer", oldValue: 27, newValue: 28, effectiveFrom: "2026-05-01T00:00", reason: "Margin update", createdBy: "Manager", createdAt: "2026-04-05T09:30" },
];

// ===== INVOICES =====
export interface InvoiceLine {
  productId: string;
  qty: number;
  rate: number;
  basic: number;
  cgstAmt: number;
  sgstAmt: number;
  total: number;
}
export interface Invoice {
  id: string; // INV-####
  indentId: string;
  customerId: string;
  routeId: string;
  date: string;
  lines: InvoiceLine[];
  subtotal: number;
  cgst: number;
  sgst: number;
  total: number;
  payMode: "Cash" | "Credit";
  status: "Paid" | "Unpaid" | "Partial";
  amountPaid: number;
}

const buildInvoicesFromIndents = (): Invoice[] => {
  return indents.map((ind, idx) => {
    const cust = customers.find(c => c.id === ind.customerId);
    const cat = cust?.rateCategory || "Retail-Dealer";
    const lines: InvoiceLine[] = ind.items.map(it => {
      const p = products.find(pr => pr.id === it.productId)!;
      const rate = p.rateCategories[cat] ?? p.mrp;
      const gross = rate * it.quantity;
      const basic = +(gross / (1 + (p.gstPercent || 0) / 100)).toFixed(2);
      const cgstAmt = +(basic * (p.cgst / 100)).toFixed(2);
      const sgstAmt = +(basic * (p.sgst / 100)).toFixed(2);
      return { productId: p.id, qty: it.quantity, rate, basic, cgstAmt, sgstAmt, total: +gross.toFixed(2) };
    });
    const subtotal = +lines.reduce((s, l) => s + l.basic, 0).toFixed(2);
    const cgst = +lines.reduce((s, l) => s + l.cgstAmt, 0).toFixed(2);
    const sgst = +lines.reduce((s, l) => s + l.sgstAmt, 0).toFixed(2);
    const total = +(subtotal + cgst + sgst).toFixed(2);
    const payMode = cust?.payMode || "Cash";
    const status: Invoice["status"] = payMode === "Cash" ? "Paid" : (idx % 3 === 0 ? "Partial" : "Unpaid");
    return {
      id: `INV-${String(2600 + idx).padStart(5, "0")}`,
      indentId: ind.id,
      customerId: ind.customerId,
      routeId: ind.routeId,
      date: ind.date,
      lines, subtotal, cgst, sgst, total,
      payMode,
      status,
      amountPaid: status === "Paid" ? total : status === "Partial" ? +(total / 2).toFixed(2) : 0,
    };
  });
};

export const invoices: Invoice[] = buildInvoicesFromIndents();

// ===== PAYMENTS =====
export interface PaymentAllocation { invoiceId: string; amount: number; }
export interface Payment {
  id: string;
  receiptNo: string;
  date: string;
  customerId: string;
  mode: "Cash" | "UPI" | "Cheque" | "Bank";
  reference: string;
  amount: number;
  allocations: PaymentAllocation[];
  notes?: string;
}

export const payments: Payment[] = [
  { id: "PAY1", receiptNo: "RCT-0001", date: "2026-04-07", customerId: "C2", mode: "UPI", reference: "UPI-7889654", amount: 15000, allocations: [{ invoiceId: invoices[1]?.id || "INV-02601", amount: 15000 }] },
  { id: "PAY2", receiptNo: "RCT-0002", date: "2026-04-06", customerId: "C3", mode: "Cheque", reference: "CHQ-008812", amount: 8000, allocations: [{ invoiceId: invoices[2]?.id || "INV-02602", amount: 8000 }] },
  { id: "PAY3", receiptNo: "RCT-0003", date: "2026-04-08", customerId: "C5", mode: "Cash", reference: "-", amount: 3780, allocations: [{ invoiceId: invoices[4]?.id || "INV-02604", amount: 3780 }] },
];
