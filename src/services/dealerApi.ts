/**
 * Dealer app mock API — simulates a per-dealer order/credit/standing-indent backend.
 */
import { products, customers, type Product } from "@/data/mockData";

const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

export const CURRENT_DEALER_ID = "C1";

export interface StandingItem {
  productId: string;
  defaultQty: number;
  active: boolean;
}

export interface OrderItem {
  productId: string;
  qty: number;
}

export type OrderStatus = "draft" | "confirmed" | "locked" | "dispatched" | "delivered";

export interface DealerOrder {
  id: string;
  dealerId: string;
  deliveryDate: string;
  createdAt: string;
  status: OrderStatus;
  standingItems: OrderItem[];
  adjustmentItems: OrderItem[];
  subtotal: number;
  gst: number;
  total: number;
  paymentMode: "credit" | "razorpay";
  paymentId?: string;
}

export interface DealerCredit {
  dealerId: string;
  limit: number;
  used: number;
}

export interface RazorpayPayment {
  id: string;
  dealerId: string;
  kind: "order" | "topup";
  orderId?: string;
  amount: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signature: string;
  status: "paid" | "failed";
  createdAt: string;
}

export interface DealerNotificationPref {
  dealerId: string;
  credit80: boolean;
  credit100: boolean;
  closingReminder: boolean;
  paymentDue: boolean;
  dispatched: boolean;
  autoConfirmPreview: boolean;
}

// ===== SEED =====
const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const standingIndent: StandingItem[] = [
  { productId: "P1", defaultQty: 20, active: true },
  { productId: "P2", defaultQty: 10, active: true },
  { productId: "P3", defaultQty: 8, active: true },
  { productId: "P4", defaultQty: 30, active: true },
  { productId: "P5", defaultQty: 12, active: true },
  { productId: "P9", defaultQty: 12, active: true },
  { productId: "P11", defaultQty: 10, active: true },
  { productId: "P16", defaultQty: 20, active: true },
  { productId: "P19", defaultQty: 15, active: true },
  { productId: "P20", defaultQty: 18, active: true },
  { productId: "P22", defaultQty: 10, active: true },
  { productId: "P33", defaultQty: 12, active: true },
  // Eligible (inactive — dealer can opt in)
  { productId: "P6", defaultQty: 0, active: false },
  { productId: "P10", defaultQty: 0, active: false },
  { productId: "P12", defaultQty: 0, active: false },
  { productId: "P13", defaultQty: 0, active: false },
  { productId: "P14", defaultQty: 0, active: false },
  { productId: "P15", defaultQty: 0, active: false },
  { productId: "P17", defaultQty: 0, active: false },
  { productId: "P18", defaultQty: 0, active: false },
  { productId: "P21", defaultQty: 0, active: false },
  { productId: "P23", defaultQty: 0, active: false },
  { productId: "P24", defaultQty: 0, active: false },
  { productId: "P25", defaultQty: 0, active: false },
  { productId: "P26", defaultQty: 0, active: false },
  { productId: "P28", defaultQty: 0, active: false },
  { productId: "P34", defaultQty: 0, active: false },
  { productId: "P35", defaultQty: 0, active: false },
];

const credit: DealerCredit = { dealerId: CURRENT_DEALER_ID, limit: 50000, used: 12400 };

const dealerOrders: DealerOrder[] = [];
const payments: RazorpayPayment[] = [];

const notifPrefs: DealerNotificationPref = {
  dealerId: CURRENT_DEALER_ID,
  credit80: true,
  credit100: true,
  closingReminder: true,
  paymentDue: true,
  dispatched: true,
  autoConfirmPreview: true,
};

// ===== HELPERS =====
function priceFor(p: Product): number {
  const cust = customers.find((c) => c.id === CURRENT_DEALER_ID);
  const cat = cust?.rateCategory || "Retail-Dealer";
  return p.rateCategories[cat] ?? p.mrp;
}

function computeTotals(items: OrderItem[]) {
  let subtotal = 0;
  let gst = 0;
  items.forEach(({ productId, qty }) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    const rate = priceFor(p);
    const lineNet = rate * qty;
    subtotal += lineNet;
    gst += (lineNet * p.gstPercent) / 100;
  });
  subtotal = +subtotal.toFixed(2);
  gst = +gst.toFixed(2);
  return { subtotal, gst, total: +(subtotal + gst).toFixed(2) };
}

function buildDraftFromStanding(deliveryDate: string): DealerOrder {
  const standingItems: OrderItem[] = standingIndent
    .filter((s) => s.active && s.defaultQty > 0)
    .map((s) => ({ productId: s.productId, qty: s.defaultQty }));
  const totals = computeTotals(standingItems);
  return {
    id: `DO-${deliveryDate}`,
    dealerId: CURRENT_DEALER_ID,
    deliveryDate,
    createdAt: new Date().toISOString(),
    status: "draft",
    standingItems,
    adjustmentItems: [],
    ...totals,
    paymentMode: "credit",
  };
}

// Seed a few past orders
[7, 5, 3, 1].forEach((daysAgo) => {
  const date = addDays(-daysAgo);
  const draft = buildDraftFromStanding(date);
  draft.status = daysAgo === 1 ? "delivered" : "delivered";
  draft.id = `DO-${date}`;
  dealerOrders.push(draft);
});
// Today draft
dealerOrders.push(buildDraftFromStanding(todayISO()));

// ===== API =====
export const dealerApi = {
  async getCurrentDealer() {
    await delay();
    return customers.find((c) => c.id === CURRENT_DEALER_ID)!;
  },

  async getCredit(): Promise<DealerCredit> {
    await delay();
    return { ...credit };
  },

  async getOrderForDate(deliveryDate: string): Promise<DealerOrder> {
    await delay();
    let order = dealerOrders.find((o) => o.deliveryDate === deliveryDate && o.dealerId === CURRENT_DEALER_ID);
    if (!order) {
      order = buildDraftFromStanding(deliveryDate);
      dealerOrders.push(order);
    }
    return { ...order, standingItems: [...order.standingItems], adjustmentItems: [...order.adjustmentItems] };
  },

  async upsertDraft(
    deliveryDate: string,
    patch: { standingItems?: OrderItem[]; adjustmentItems?: OrderItem[]; paymentMode?: "credit" | "razorpay" }
  ): Promise<DealerOrder> {
    await delay(150);
    let order = dealerOrders.find((o) => o.deliveryDate === deliveryDate);
    if (!order) {
      order = buildDraftFromStanding(deliveryDate);
      dealerOrders.push(order);
    }
    if (patch.standingItems) order.standingItems = patch.standingItems;
    if (patch.adjustmentItems) order.adjustmentItems = patch.adjustmentItems;
    if (patch.paymentMode) order.paymentMode = patch.paymentMode;
    const totals = computeTotals([...order.standingItems, ...order.adjustmentItems]);
    Object.assign(order, totals);
    return { ...order };
  },

  async confirmOrder(deliveryDate: string, paymentId?: string): Promise<DealerOrder> {
    await delay(300);
    const order = dealerOrders.find((o) => o.deliveryDate === deliveryDate);
    if (!order) throw new Error("Order not found");
    order.status = "confirmed";
    if (paymentId) order.paymentId = paymentId;
    if (order.paymentMode === "credit") credit.used = +(credit.used + order.total).toFixed(2);
    return { ...order };
  },

  async listOrders(): Promise<DealerOrder[]> {
    await delay();
    return [...dealerOrders]
      .filter((o) => o.dealerId === CURRENT_DEALER_ID)
      .sort((a, b) => b.deliveryDate.localeCompare(a.deliveryDate));
  },

  async getOrder(id: string): Promise<DealerOrder | undefined> {
    await delay();
    const o = dealerOrders.find((x) => x.id === id);
    return o ? { ...o } : undefined;
  },

  async listStandingIndent(): Promise<StandingItem[]> {
    await delay();
    return [...standingIndent];
  },

  async setStandingItem(productId: string, patch: Partial<StandingItem>) {
    await delay(150);
    const s = standingIndent.find((x) => x.productId === productId);
    if (s) Object.assign(s, patch);
    return s;
  },

  async getNotificationPrefs(): Promise<DealerNotificationPref> {
    await delay();
    return { ...notifPrefs };
  },

  async setNotificationPrefs(patch: Partial<DealerNotificationPref>) {
    await delay(150);
    Object.assign(notifPrefs, patch);
    return { ...notifPrefs };
  },

  async simulateRazorpayPayment(amount: number, kind: "order" | "topup", orderId?: string): Promise<RazorpayPayment> {
    await delay(800);
    const pay: RazorpayPayment = {
      id: `RP${payments.length + 1}`,
      dealerId: CURRENT_DEALER_ID,
      kind,
      orderId,
      amount,
      razorpayOrderId: `order_${Math.random().toString(36).slice(2, 12)}`,
      razorpayPaymentId: `pay_${Math.random().toString(36).slice(2, 12)}`,
      signature: Math.random().toString(36).slice(2, 18),
      status: "paid",
      createdAt: new Date().toISOString(),
    };
    payments.push(pay);
    if (kind === "topup") {
      credit.used = Math.max(0, +(credit.used - amount).toFixed(2));
    }
    return pay;
  },

  getProductPrice: priceFor,
};
