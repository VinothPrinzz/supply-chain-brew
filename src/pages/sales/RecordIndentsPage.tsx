import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { fetchProducts, fetchCustomers, fetchBatches, fetchIndents, createIndent, resetIndents, getAgents } from "@/services/api";
import { authSchema, type AuthFormData } from "@/lib/validations";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/data/mockData";

const RecordIndentsPage = () => {
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: batches = [] } = useQuery({ queryKey: ["batches"], queryFn: fetchBatches });
  const agents = getAgents();
  const qc = useQueryClient();

  const [selectedBatch, setSelectedBatch] = useState("");
  const [indentDate, setIndentDate] = useState("2026-04-08");
  const [agentCode, setAgentCode] = useState("");
  const [showIndent, setShowIndent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const resetForm = useForm<AuthFormData>({ resolver: zodResolver(authSchema) });

  const handleGo = () => {
    if (!selectedBatch || !agentCode) { toast.error("Select batch and agent code"); return; }
    setShowIndent(true);
    setQuantities({});
  };

  const activeProducts = products.filter(p => !p.terminated);
  const agent = agents.find(a => a.code === agentCode);
  const agentCustomers = customers.filter(c => c.status === "Active");
  const selectedCustomer = agentCustomers[0];

  const updateQty = (pid: string, qty: number) => setQuantities(prev => ({ ...prev, [pid]: qty }));

  const orderItems = activeProducts.filter(p => (quantities[p.id] || 0) > 0).map(p => {
    const qty = quantities[p.id] || 0;
    const rate = p.rateCategories[selectedCustomer?.rateCategory || "Retail-Dealer"] || p.mrp;
    const amount = qty * rate;
    const gst = amount * (p.gstPercent / 100);
    return { product: p, qty, rate, amount, gst };
  });

  const totalAmount = orderItems.reduce((s, i) => s + i.amount, 0);
  const totalGst = orderItems.reduce((s, i) => s + i.gst, 0);

  const placeMutation = useMutation({
    mutationFn: () => createIndent({
      customerId: selectedCustomer?.id,
      batchId: selectedBatch,
      routeId: selectedCustomer?.routeId,
      date: indentDate,
      items: orderItems.map(i => ({ productId: i.product.id, quantity: i.qty })),
      agentCode,
      totalAmount,
      gstAmount: totalGst,
    }),
    onSuccess: () => {
      toast.success("Indent placed successfully");
      setQuantities({});
      qc.invalidateQueries({ queryKey: ["indents"] });
    },
  });

  const resetMutation = useMutation({
    mutationFn: (data: AuthFormData) => resetIndents(data.username, data.password),
    onSuccess: () => { toast.success("Indents reset successfully"); setShowReset(false); resetForm.reset(); },
  });

  return (
    <div>
      <PageHeader title="Record Indents" description="Record daily indents from agents" actions={<Button variant="destructive" size="sm" onClick={() => setShowReset(true)}>Reset Indents</Button>} />
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Select Batch & Agent</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div><Label>Batch</Label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-52"><SelectValue placeholder="Select batch" /></SelectTrigger>
                <SelectContent>{batches.map(b => <SelectItem key={b.id} value={b.id}>{b.name} ({b.timing})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Indent Date</Label><Input type="date" value={indentDate} onChange={e => setIndentDate(e.target.value)} className="w-44" /></div>
            <div><Label>Agent Code</Label>
              <Select value={agentCode} onValueChange={setAgentCode}>
                <SelectTrigger className="w-52"><SelectValue placeholder="Select agent" /></SelectTrigger>
                <SelectContent>{agents.map(a => <SelectItem key={a.code} value={a.code}>{a.code} — {a.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button onClick={handleGo}>GO</Button>
          </div>
        </CardContent>
      </Card>

      {showIndent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Indent Entry — {agent?.name}</CardTitle>
                  {selectedCustomer && (
                    <span className="text-sm text-muted-foreground">Credit Balance: <span className="font-semibold text-foreground">₹{selectedCustomer.creditBalance.toLocaleString()}</span></span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-muted/30">
                      <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Product</th>
                      <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Rate</th>
                      <th className="text-center py-2.5 px-3 font-medium text-muted-foreground">Qty (Pkts)</th>
                      <th className="text-center py-2.5 px-3 font-medium text-muted-foreground">Crates</th>
                      <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Amount</th>
                    </tr></thead>
                    <tbody>
                      {activeProducts.map(p => {
                        const qty = quantities[p.id] || 0;
                        const rate = p.rateCategories[selectedCustomer?.rateCategory || "Retail-Dealer"] || p.mrp;
                        return (
                          <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="py-2 px-3">{p.name}</td>
                            <td className="py-2 px-3 text-right font-mono">₹{rate}</td>
                            <td className="py-2 px-3 text-center"><Input type="number" className="w-20 mx-auto text-center" value={qty || ""} onChange={e => updateQty(p.id, parseInt(e.target.value) || 0)} /></td>
                            <td className="py-2 px-3 text-center text-muted-foreground">{qty > 0 ? Math.ceil(qty / p.packetsPerCrate) : 0}</td>
                            <td className="py-2 px-3 text-right font-mono">{qty > 0 ? `₹${(qty * rate).toFixed(2)}` : "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader><CardTitle className="text-base">Indent Summary</CardTitle></CardHeader>
              <CardContent>
                {orderItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Enter quantities to see summary</p>
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
                    <Button className="w-full mt-4" onClick={() => placeMutation.mutate()} disabled={placeMutation.isPending}>
                      {placeMutation.isPending ? "Placing..." : "Place Indent"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Dialog open={showReset} onOpenChange={setShowReset}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reset Indents</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">Enter your credentials to reset all indents for today.</p>
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(data => resetMutation.mutate(data))}>
              <div className="space-y-3">
                <FormField control={resetForm.control} name="username" render={({ field }) => (
                  <FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="Username" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={resetForm.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="Password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" type="button" onClick={() => setShowReset(false)}>Cancel</Button>
                <Button variant="destructive" type="submit" disabled={resetMutation.isPending}>
                  {resetMutation.isPending ? "Resetting..." : "Confirm Reset"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecordIndentsPage;
