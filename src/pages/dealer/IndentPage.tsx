import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO, isToday } from "date-fns";
import { Star, Plus, MoreVertical, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { dealerApi, type OrderItem } from "@/services/dealerApi";
import { products } from "@/data/mockData";
import DateStrip from "@/components/dealer/DateStrip";
import QtyStepper from "@/components/dealer/QtyStepper";
import RazorpaySheet from "@/components/dealer/RazorpaySheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CLOSING_HOUR = 18; // 6pm closing for today

function getCountdown(): string | null {
  const now = new Date();
  const close = new Date();
  close.setHours(CLOSING_HOUR, 0, 0, 0);
  const ms = close.getTime() - now.getTime();
  if (ms <= 0) return null;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

function productById(id: string) {
  return products.find((p) => p.id === id);
}

const IndentPage: React.FC = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [sp, setSp] = useSearchParams();
  const initialDate = sp.get("date") || format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = useState(initialDate);
  const [paymentMode, setPaymentMode] = useState<"credit" | "razorpay">("credit");
  const [showRzp, setShowRzp] = useState(false);
  const [countdown, setCountdown] = useState(getCountdown());

  useEffect(() => {
    const t = setInterval(() => setCountdown(getCountdown()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setSp({ date }, { replace: true });
  }, [date, setSp]);

  const { data: order } = useQuery({
    queryKey: ["dealer", "order", date],
    queryFn: () => dealerApi.getOrderForDate(date),
  });
  const { data: credit } = useQuery({ queryKey: ["dealer", "credit"], queryFn: dealerApi.getCredit });

  const update = useMutation({
    mutationFn: (patch: { standingItems?: OrderItem[]; adjustmentItems?: OrderItem[] }) =>
      dealerApi.upsertDraft(date, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dealer", "order", date] }),
  });

  const confirm = useMutation({
    mutationFn: (paymentId?: string) => dealerApi.confirmOrder(date, paymentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dealer", "order", date] });
      qc.invalidateQueries({ queryKey: ["dealer", "credit"] });
      qc.invalidateQueries({ queryKey: ["dealer", "orders"] });
      toast.success("Order confirmed");
    },
  });

  const selectedDate = parseISO(date);
  const dateIsToday = isToday(selectedDate);
  const windowClosed = dateIsToday && !countdown;
  const isFuture = !dateIsToday && selectedDate > new Date();
  const readOnly = windowClosed || (order && order.status !== "draft");

  const available = credit ? credit.limit - credit.used : 0;
  const total = order?.total ?? 0;
  const overflow = paymentMode === "credit" ? Math.max(0, total - available) : 0;

  const updateStanding = (productId: string, qty: number) => {
    if (!order) return;
    const items = order.standingItems.map((i) => (i.productId === productId ? { ...i, qty } : i));
    update.mutate({ standingItems: items });
  };
  const removeStanding = (productId: string) => {
    if (!order) return;
    update.mutate({ standingItems: order.standingItems.filter((i) => i.productId !== productId) });
  };
  const updateAdj = (productId: string, qty: number) => {
    if (!order) return;
    const items = order.adjustmentItems.map((i) => (i.productId === productId ? { ...i, qty } : i));
    update.mutate({ adjustmentItems: qty === 0 ? items.filter((i) => i.productId !== productId) : items });
  };

  const banner = useMemo(() => {
    if (windowClosed) return { tone: "muted" as const, text: "Locked — delivery in progress" };
    if (dateIsToday) return { tone: "amber" as const, text: `Closes in ${countdown}` };
    if (isFuture)
      return { tone: "blue" as const, text: `Editable anytime · auto-confirms at 8:00 AM on ${format(selectedDate, "EEE d MMM")}` };
    return { tone: "muted" as const, text: "Past date" };
  }, [windowClosed, dateIsToday, countdown, isFuture, selectedDate]);

  const handleConfirm = () => {
    if (overflow > 0) {
      toast.error("Insufficient credit — top up or pay now");
      return;
    }
    if (paymentMode === "razorpay") {
      setShowRzp(true);
      return;
    }
    confirm.mutate(undefined);
  };

  return (
    <div>
      <DateStrip value={date} onChange={setDate} closingCountdown={dateIsToday ? countdown : null} />

      <div
        className={`mx-3 mt-3 rounded-md p-3 text-xs ${
          banner.tone === "amber"
            ? "bg-amber-50 text-amber-900 border border-amber-200"
            : banner.tone === "blue"
            ? "bg-blue-50 text-blue-900 border border-blue-200"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {banner.text}
      </div>

      {/* Standing items */}
      <section className="mt-4 px-3">
        <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          STANDING INDENT
        </div>
        <Card className="divide-y">
          {order?.standingItems.length === 0 && (
            <div className="p-3 text-xs text-muted-foreground text-center">No standing items</div>
          )}
          {order?.standingItems.map((it) => {
            const p = productById(it.productId);
            if (!p) return null;
            const rate = dealerApi.getProductPrice(p);
            return (
              <div key={it.productId} className="p-3 flex items-center gap-2">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm truncate">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground">₹{rate} · {p.category}</div>
                </div>
                <QtyStepper value={it.qty} onChange={(n) => updateStanding(it.productId, n)} disabled={readOnly} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" disabled={readOnly}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => removeStanding(it.productId)}>
                      Remove from today only
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        await dealerApi.setStandingItem(it.productId, { active: false });
                        removeStanding(it.productId);
                        toast.success("Removed from standing indent");
                      }}
                    >
                      Remove from standing
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </Card>
      </section>

      {/* Adjustments */}
      <section className="mt-4 px-3">
        <div className="text-xs font-semibold text-muted-foreground mb-2">ADJUSTMENTS</div>
        <Card className="divide-y">
          {order?.adjustmentItems.length === 0 && (
            <div className="p-3 text-xs text-muted-foreground text-center">No extras added</div>
          )}
          {order?.adjustmentItems.map((it) => {
            const p = productById(it.productId);
            if (!p) return null;
            const rate = dealerApi.getProductPrice(p);
            return (
              <div key={it.productId} className="p-3 flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-sm truncate">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground">₹{rate} · {p.category}</div>
                </div>
                <QtyStepper value={it.qty} onChange={(n) => updateAdj(it.productId, n)} disabled={readOnly} />
              </div>
            );
          })}
        </Card>
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => navigate(`/dealer/catalog?date=${date}`)}
          disabled={readOnly}
        >
          <Plus className="h-4 w-4 mr-1" /> Add items
        </Button>
      </section>

      {/* Summary */}
      <section className="mt-4 px-3">
        <Card className="p-3 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{order?.subtotal.toLocaleString("en-IN")}</span></div>
          <div className="flex justify-between text-muted-foreground"><span>GST</span><span>₹{order?.gst.toLocaleString("en-IN")}</span></div>
          <div className="flex justify-between font-semibold pt-1 border-t"><span>Total</span><span>₹{order?.total.toLocaleString("en-IN")}</span></div>
        </Card>
      </section>

      {/* Payment selector */}
      {!readOnly && (
        <section className="mt-4 px-3">
          {overflow > 0 ? (
            <Card className="p-3 border-amber-300 bg-amber-50">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-xs text-amber-900">
                  Order is ₹{overflow.toLocaleString("en-IN")} over your available credit.
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate("/dealer/profile/credit")}>
                  Top up credit
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setPaymentMode("razorpay");
                    setShowRzp(true);
                  }}
                >
                  Pay this order
                </Button>
              </div>
            </Card>
          ) : (
            <RadioGroup value={paymentMode} onValueChange={(v: "credit" | "razorpay") => setPaymentMode(v)} className="space-y-2">
              <Card className="p-3">
                <Label className="flex items-start gap-2 cursor-pointer">
                  <RadioGroupItem value="credit" className="mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Use Credit Limit</div>
                    <div className="text-xs text-muted-foreground">
                      ₹{available.toLocaleString("en-IN")} available of ₹{credit?.limit.toLocaleString("en-IN")}
                    </div>
                    {credit && <Progress value={(credit.used / credit.limit) * 100} className="h-1.5 mt-2" />}
                  </div>
                </Label>
              </Card>
              <Card className="p-3">
                <Label className="flex items-start gap-2 cursor-pointer">
                  <RadioGroupItem value="razorpay" className="mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Pay Now (Razorpay)</div>
                    <div className="text-xs text-muted-foreground">UPI · Card · Netbanking</div>
                  </div>
                </Label>
              </Card>
            </RadioGroup>
          )}
        </section>
      )}

      {/* Sticky confirm */}
      {!readOnly && (
        <div className="sticky bottom-16 left-0 right-0 px-3 py-3 bg-background border-t mt-4">
          <Button className="w-full h-11" onClick={handleConfirm} disabled={overflow > 0 || confirm.isPending}>
            {dateIsToday ? "Confirm Indent for Today" : isFuture ? `Save for ${format(selectedDate, "EEE d MMM")}` : "Confirm"}
            {" · "}₹{total.toLocaleString("en-IN")}
          </Button>
        </div>
      )}

      <RazorpaySheet
        open={showRzp}
        amount={total}
        title="Pay for order"
        onClose={() => setShowRzp(false)}
        onPay={() => dealerApi.simulateRazorpayPayment(total, "order", order?.id)}
        onPaid={(pid) => {
          setShowRzp(false);
          confirm.mutate(pid);
        }}
      />
    </div>
  );
};

export default IndentPage;
