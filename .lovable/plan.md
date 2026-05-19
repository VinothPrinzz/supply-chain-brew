# Dealer App — Mobile-Style Frontend

A separate dealer-facing app mounted under `/dealer/*` in the same project, designed as a mobile-first PWA-style experience. Admin pages stay untouched. All data uses the existing mock layer (`services/api.ts` + `data/mockData.ts`) extended with new dealer entities — no real backend yet.

---

## Routing & Shell

New route group `/dealer/*` bypassing `AppLayout` (no admin sidebar). New `DealerLayout` with:
- Top dealer header (name, code, credit chip)
- Page slot
- **Bottom tab bar (4 tabs)**: Indent · Catalog · Orders · Profile

Mounted in `src/App.tsx` outside the existing `<AppLayout>` route tree.

Routes:
- `/dealer` → redirect to `/dealer/indent`
- `/dealer/indent`
- `/dealer/catalog`
- `/dealer/orders`
- `/dealer/orders/:id` (order detail + invoice viewer)
- `/dealer/profile`
- `/dealer/profile/standing-indent`
- `/dealer/profile/credit`
- `/dealer/profile/notifications`

A dev "Open Dealer App" link added to the admin Dashboard (and reverse link back to admin from dealer Profile) so both shells are reachable.

---

## Data Model (mock)

Extends `src/data/mockData.ts`:

```ts
type DealerStandingIndent = {
  dealerId: string; productId: string; defaultQty: number; active: boolean;
};

type DealerOrder = {
  id: string; dealerId: string;
  deliveryDate: string;          // YYYY-MM-DD
  createdAt: string;             // ISO
  status: "draft" | "confirmed" | "locked" | "dispatched" | "delivered";
  standingItems: { productId: string; qty: number }[];
  adjustmentItems: { productId: string; qty: number }[];
  subtotal: number; gst: number; total: number;
  paymentMode: "credit" | "razorpay";
  paymentId?: string;
};

type DealerCredit = {
  dealerId: string; limit: number; used: number; // available = limit - used
};

type RazorpayPayment = {
  id: string; dealerId: string;
  kind: "order" | "topup";
  orderId?: string; amount: number;
  razorpayOrderId: string; razorpayPaymentId: string; signature: string;
  status: "created" | "paid" | "failed"; createdAt: string;
};

type DealerNotificationPref = {
  dealerId: string;
  credit80: boolean; credit100: boolean;
  closingReminder: boolean; paymentDue: boolean; dispatched: boolean;
  autoConfirmPreview: boolean;
};
```

Seed: 1 logged-in mock dealer (`D1`) with credit ₹50,000 (₹12,400 used), ~12 active standing-indent products, a few past orders, and a draft order pre-materialized for today.

A `services/dealerApi.ts` module exposes: `getCurrentDealer`, `getCredit`, `getOrderForDate`, `upsertDraft`, `confirmOrder`, `listOrders`, `getOrder`, `listStandingIndent`, `setStandingItem`, `getNotificationPrefs`, `setNotificationPrefs`, `simulateRazorpayPayment`, `simulateTopup`. All async with `setTimeout` delay, mirroring existing api.ts style.

---

## Indent Tab (`/dealer/indent`)

Top-to-bottom layout:

1. **Dealer header** — name, code, "Credit ₹37,600 / ₹50,000" chip.
2. **Date selector strip** — horizontally scrollable chips: Today (countdown badge if window open), Tomorrow, +2, weekday labels for next 7 days, then 📅 opens a `Calendar` modal. Selected chip drives the rest of the page.
3. **Status banner**:
   - Today + open → "Closes in Xh Ym" (amber)
   - Today + closed → "Locked — delivery in progress" (gray, read-only)
   - Future → "Editable anytime · auto-confirms at 8:00 AM on {date}" (blue)
4. **Standing Indent section** — compact rows: ⭐ icon · product name+pack · `– qty +` stepper · ⋯ menu ("Remove from today only" / "Remove from standing").
5. **Adjustments section** — same row style, no ⭐. Empty state: "No extras added".
6. **"+ Add items" button** — `navigate('/dealer/catalog?date=...&mode=add')`.
7. **Order summary card** — subtotal · GST · total.
8. **Payment selector** — two radio cards:
   - Use Credit Limit (default) — shows available + progress bar
   - Pay Now (Razorpay) — opens mock Razorpay sheet on confirm
9. **Sticky Confirm button** — label adapts to selected date. Disabled when locked.
10. **Credit-insufficient state** — replaces payment selector with amber card: "Order is ₹X over available credit" + two CTAs (Top up / Pay this order). Confirm disabled until resolved.

Read-only mode (today after closing) hides steppers and shows summary only.

---

## Catalog Tab (`/dealer/catalog`)

Master-detail:
- **Left rail (~90px)** — vertical category list with icon + name, active highlighted.
- **Right pane** — product cards in selected category with `– qty +` steppers bound to the *current selected delivery date's draft*.
- **Search bar** pinned top — searches across all categories; overrides rail while typing.
- **Floating "View Indent" pill** at bottom showing running total → returns to `/dealer/indent`.

Categories are derived from `products[].category`.

---

## Orders Tab (`/dealer/orders`)

- List of past + upcoming orders (cards), each: delivery date · status pill · item count · total · "View" + "Invoice" buttons.
- `/dealer/orders/:id` — order detail showing items, totals, payment info, and a tappable **Invoice** section that opens an A4-style invoice viewer (re-using the existing `InvoiceDetailPage` layout adapted for mobile width).

---

## Profile Tab (`/dealer/profile`)

Sections (in order):
1. **Dealer card** — name, code, phone, route.
2. **Credit Limit card** — used / limit with progress bar + **Top Up** button → mock Razorpay top-up sheet (`/dealer/profile/credit`).
3. **Standing Indent manager** (`/dealer/profile/standing-indent`) — list of eligible products (admin's `makeZero=false` filter); each row: toggle active + qty stepper. Saves to `dealerStandingIndents`.
4. **Notifications** (`/dealer/profile/notifications`) — toggle list for: credit 80%, credit 100%, closing reminder, payment due, dispatched, auto-confirm preview.
5. **Settings / Logout** — link back to admin app (dev only), version info.

---

## Notifications

Implemented as toast triggers + an in-page banner where relevant. No real push — surfaced when conditions met during navigation:
- Credit ≥ 80% → amber toast on Indent open
- Credit ≥ 100% / overflow at confirm → blocking modal
- Closing window <15 min with unsaved adjustments → amber sticky banner
- Auto-confirm preview (mock "last night") → info card on Indent for tomorrow

---

## Razorpay (mocked)

A `RazorpaySheet` modal component simulates the Razorpay flow:
- Shows amount, dummy UPI/Card tabs, "Pay ₹X" button
- On click → 1s spinner → success → writes a `RazorpayPayment` row, returns `{paymentId}`
- Used by both order pay-now and credit top-up

Real integration intentionally deferred until Lovable Cloud is enabled.

---

## File Map

**New:**
- `src/components/dealer/DealerLayout.tsx` — header + bottom tab bar shell
- `src/components/dealer/DateStrip.tsx`
- `src/components/dealer/QtyStepper.tsx`
- `src/components/dealer/ProductRow.tsx`
- `src/components/dealer/RazorpaySheet.tsx`
- `src/components/dealer/CreditBar.tsx`
- `src/pages/dealer/IndentPage.tsx`
- `src/pages/dealer/CatalogPage.tsx`
- `src/pages/dealer/OrdersPage.tsx`
- `src/pages/dealer/OrderDetailPage.tsx`
- `src/pages/dealer/ProfilePage.tsx`
- `src/pages/dealer/StandingIndentPage.tsx`
- `src/pages/dealer/CreditPage.tsx`
- `src/pages/dealer/NotificationsPage.tsx`
- `src/services/dealerApi.ts`

**Edited:**
- `src/data/mockData.ts` — add dealer entities + seed
- `src/App.tsx` — mount `/dealer/*` route group outside `AppLayout`
- `src/pages/Dashboard.tsx` — add "Open Dealer App" link

---

## Technical notes

- Mobile-first: max-width container `max-w-md mx-auto`, bottom-tab `h-16 fixed bottom-0`. Works on desktop preview (centered card) and mobile.
- All forms via react-hook-form + zod (consistent with existing pages).
- TanStack Query for fetching; mutations invalidate `['dealer','draft', date]` etc.
- Semantic tokens only — extend `index.css` if a dealer-specific accent is needed (kept to existing palette by default).
- No backend changes; Razorpay + auto-confirm worker are stubbed so the UI is wired end-to-end and ready to swap to Lovable Cloud later.
