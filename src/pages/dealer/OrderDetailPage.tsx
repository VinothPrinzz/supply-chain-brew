import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ArrowLeft, FileText } from "lucide-react";
import { dealerApi } from "@/services/dealerApi";
import { products, customers } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const OrderDetailPage: React.FC = () => {
  const { id = "" } = useParams();
  const [showInvoice, setShowInvoice] = useState(false);
  const { data: order } = useQuery({ queryKey: ["dealer", "order-detail", id], queryFn: () => dealerApi.getOrder(id) });
  const dealer = customers.find((c) => c.id === order?.dealerId);

  if (!order) return <div className="p-4 text-sm text-muted-foreground">Loading…</div>;

  const allItems = [
    ...order.standingItems.map((i) => ({ ...i, standing: true })),
    ...order.adjustmentItems.map((i) => ({ ...i, standing: false })),
  ];

  return (
    <div className="p-3 space-y-3">
      <Link to="/dealer/orders" className="text-xs text-muted-foreground inline-flex items-center gap-1">
        <ArrowLeft className="h-3 w-3" /> Back to orders
      </Link>

      <Card className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Delivery date</div>
            <div className="text-base font-semibold">{format(parseISO(order.deliveryDate), "EEE, d MMM yyyy")}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="text-sm font-medium capitalize">{order.status}</div>
          </div>
        </div>
      </Card>

      <Card className="divide-y">
        {allItems.map((it) => {
          const p = products.find((x) => x.id === it.productId);
          if (!p) return null;
          const rate = dealerApi.getProductPrice(p);
          return (
            <div key={it.productId} className="p-3 flex items-center justify-between text-sm">
              <div className="min-w-0 flex-1">
                <div className="truncate">{p.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {it.qty} × ₹{rate} {it.standing && "· standing"}
                </div>
              </div>
              <div className="font-medium">₹{(rate * it.qty).toFixed(2)}</div>
            </div>
          );
        })}
      </Card>

      <Card className="p-3 text-sm space-y-1">
        <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString("en-IN")}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>GST</span><span>₹{order.gst.toLocaleString("en-IN")}</span></div>
        <div className="flex justify-between font-semibold border-t pt-1"><span>Total</span><span>₹{order.total.toLocaleString("en-IN")}</span></div>
        <div className="text-[11px] text-muted-foreground pt-1">
          Payment: {order.paymentMode === "credit" ? "Credit limit" : "Razorpay"}
          {order.paymentId && ` · ${order.paymentId}`}
        </div>
      </Card>

      <Button variant="outline" className="w-full" onClick={() => setShowInvoice(true)}>
        <FileText className="h-4 w-4 mr-2" /> View Invoice
      </Button>

      <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
        <DialogContent className="max-w-md p-0">
          <div className="p-6 bg-white text-black text-xs space-y-3" style={{ fontFamily: "monospace" }}>
            <div className="text-center border-b pb-2">
              <div className="font-bold text-sm">HAVERI MILK UNION</div>
              <div className="text-[10px]">Tax Invoice</div>
            </div>
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">Bill To:</div>
                <div>{dealer?.name}</div>
                <div>{dealer?.address}</div>
              </div>
              <div className="text-right">
                <div>Invoice: INV-{order.id}</div>
                <div>Date: {format(parseISO(order.deliveryDate), "dd/MM/yyyy")}</div>
              </div>
            </div>
            <table className="w-full text-[10px]">
              <thead className="border-y">
                <tr><th className="text-left">Item</th><th>Qty</th><th>Rate</th><th className="text-right">Amount</th></tr>
              </thead>
              <tbody>
                {allItems.map((it) => {
                  const p = products.find((x) => x.id === it.productId);
                  if (!p) return null;
                  const rate = dealerApi.getProductPrice(p);
                  return (
                    <tr key={it.productId} className="border-b border-dashed">
                      <td>{p.name}</td>
                      <td className="text-center">{it.qty}</td>
                      <td className="text-center">{rate}</td>
                      <td className="text-right">{(rate * it.qty).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-end">
              <div className="w-1/2 text-[10px]">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>GST</span><span>₹{order.gst.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold border-t"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetailPage;
