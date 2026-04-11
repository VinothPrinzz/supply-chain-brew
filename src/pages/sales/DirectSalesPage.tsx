import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProducts, fetchCustomers, fetchIndents, getAgents } from "@/services/api";
import { toast } from "sonner";
import type { Product } from "@/data/mockData";

interface Props { tab?: "gate-pass" | "cash-customer" | "modify"; }

const DirectSalesPage = ({ tab = "gate-pass" }: Props) => {
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: indents = [] } = useQuery({ queryKey: ["indents"], queryFn: fetchIndents });
  const agents = getAgents();

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const activeProducts = products.filter(p => !p.terminated);

  const updateQty = (pid: string, qty: number) => setQuantities(prev => ({ ...prev, [pid]: qty }));

  const orderItems = activeProducts.filter(p => (quantities[p.id] || 0) > 0).map(p => {
    const qty = quantities[p.id] || 0;
    const rate = p.rateCategories["Retail-Dealer"] || p.mrp;
    return { product: p, qty, rate, amount: qty * rate, gst: qty * rate * (p.gstPercent / 100) };
  });

  const totalAmount = orderItems.reduce((s, i) => s + i.amount, 0);
  const totalGst = orderItems.reduce((s, i) => s + i.gst, 0);

  const OrderSummary = () => (
    <Card className="sticky top-4">
      <CardHeader><CardTitle className="text-base">Order Summary</CardTitle></CardHeader>
      <CardContent>
        {orderItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">Add items to see summary</p>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              {orderItems.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>{item.product.reportAlias} × {item.qty}</span>
                  <span className="font-mono">₹{item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-mono">₹{totalAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-muted-foreground"><span>GST</span><span className="font-mono">₹{totalGst.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm font-bold border-t pt-2 mt-2"><span>Total</span><span className="font-mono">₹{(totalAmount + totalGst).toFixed(2)}</span></div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const ProductEntryTable = ({ onAction, actionLabel }: { onAction: () => void; actionLabel: string }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/30">
              <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Product</th>
              <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Rate</th>
              <th className="text-center py-2.5 px-3 font-medium text-muted-foreground">Qty</th>
              <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Amount</th>
            </tr></thead>
            <tbody>
              {activeProducts.map(p => {
                const qty = quantities[p.id] || 0;
                const rate = p.rateCategories["Retail-Dealer"] || p.mrp;
                return (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 px-3">{p.name}</td>
                    <td className="py-2 px-3 text-right font-mono">₹{rate}</td>
                    <td className="py-2 px-3 text-center"><Input type="number" className="w-20 mx-auto text-center" value={qty || ""} onChange={e => updateQty(p.id, parseInt(e.target.value) || 0)} /></td>
                    <td className="py-2 px-3 text-right font-mono">{qty > 0 ? `₹${(qty * rate).toFixed(2)}` : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Button className="mt-4" onClick={onAction} disabled={orderItems.length === 0}>{actionLabel}</Button>
      </CardContent>
    </Card>
  );

  if (tab === "gate-pass") {
    return (
      <div>
        <PageHeader title="Gate Pass — Agents" description="Emergency/adhoc sales via gate pass" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4 items-end">
                  <div><Label>Agent</Label>
                    <Select><SelectTrigger className="w-52"><SelectValue placeholder="Select agent" /></SelectTrigger>
                      <SelectContent>{agents.map(a => <SelectItem key={a.code} value={a.code}>{a.code} — {a.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Date</Label><Input type="date" defaultValue="2026-04-08" className="w-44" /></div>
                </div>
              </CardContent>
            </Card>
            <ProductEntryTable onAction={() => { toast.success("Gate pass generated successfully"); setQuantities({}); }} actionLabel="Generate Gate Pass" />
          </div>
          <OrderSummary />
        </div>
      </div>
    );
  }

  if (tab === "cash-customer") {
    return (
      <div>
        <PageHeader title="Cash Customer Sale" description="Advance-paid customer sales" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4 items-end">
                  <div><Label>Customer</Label>
                    <Select><SelectTrigger className="w-52"><SelectValue placeholder="Select customer" /></SelectTrigger>
                      <SelectContent>{customers.filter(c => c.payMode === "Cash").map(c => <SelectItem key={c.id} value={c.id}>{c.code} — {c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Date</Label><Input type="date" defaultValue="2026-04-08" className="w-44" /></div>
                </div>
              </CardContent>
            </Card>
            <ProductEntryTable onAction={() => { toast.success("Sale recorded successfully"); setQuantities({}); }} actionLabel="Save Sale" />
          </div>
          <OrderSummary />
        </div>
      </div>
    );
  }

  // Modify indent
  return (
    <div>
      <PageHeader title="Modify Indent" description="Search and modify an existing indent" />
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3 items-end mb-6">
            <div><Label>Indent ID</Label><Input placeholder="e.g. IND001" className="w-40" /></div>
            <Button variant="outline">Search</Button>
          </div>
          <div className="overflow-auto rounded-md border">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/30">
                <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Indent #</th>
                <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Items</th>
                <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {indents.slice(0, 5).map(ind => {
                  const cust = customers.find(c => c.id === ind.customerId);
                  return (
                    <tr key={ind.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2 px-3 font-mono">{ind.id}</td>
                      <td className="py-2 px-3">{cust?.name}</td>
                      <td className="py-2 px-3">{ind.date}</td>
                      <td className="py-2 px-3 text-muted-foreground">{ind.items.length} items</td>
                      <td className="py-2 px-3 text-right font-mono">₹{ind.totalAmount}</td>
                      <td className="py-2 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${ind.status === "Pending" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>{ind.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectSalesPage;
