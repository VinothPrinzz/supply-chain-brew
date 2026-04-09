import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { batches, agents, products, customers } from "@/data/mockData";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const RecordIndentsPage = () => {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [indentDate, setIndentDate] = useState("2026-04-08");
  const [agentCode, setAgentCode] = useState("");
  const [showIndent, setShowIndent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleGo = () => {
    if (!selectedBatch || !agentCode) { toast.error("Select batch and agent code"); return; }
    setShowIndent(true);
    setQuantities({});
  };

  const activeProducts = products.filter((p) => !p.terminated);
  const agent = agents.find((a) => a.code === agentCode);
  const agentCustomers = customers.filter((c) => c.status === "Active");
  const selectedCustomer = agentCustomers[0];

  const updateQty = (pid: string, qty: number) => setQuantities((prev) => ({ ...prev, [pid]: qty }));

  const orderItems = activeProducts.filter((p) => (quantities[p.id] || 0) > 0).map((p) => {
    const qty = quantities[p.id] || 0;
    const rate = p.rateCategories[selectedCustomer?.rateCategory || "Retail-Dealer"] || p.mrp;
    const amount = qty * rate;
    const gst = amount * (p.gstPercent / 100);
    return { product: p, qty, rate, amount, gst };
  });

  const totalAmount = orderItems.reduce((s, i) => s + i.amount, 0);
  const totalGst = orderItems.reduce((s, i) => s + i.gst, 0);

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
                <SelectContent>{batches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name} ({b.timing})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Indent Date</Label><Input type="date" value={indentDate} onChange={(e) => setIndentDate(e.target.value)} className="w-44" /></div>
            <div><Label>Agent Code</Label>
              <Select value={agentCode} onValueChange={setAgentCode}>
                <SelectTrigger className="w-52"><SelectValue placeholder="Select agent" /></SelectTrigger>
                <SelectContent>{agents.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} — {a.name}</SelectItem>)}</SelectContent>
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
                <table className="w-full text-sm">
                  <thead><tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Product</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Rate</th>
                    <th className="text-center py-2 px-3 font-medium text-muted-foreground">Qty (Pkts)</th>
                    <th className="text-center py-2 px-3 font-medium text-muted-foreground">Crates</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Amount</th>
                  </tr></thead>
                  <tbody>
                    {activeProducts.map((p) => {
                      const qty = quantities[p.id] || 0;
                      const rate = p.rateCategories[selectedCustomer?.rateCategory || "Retail-Dealer"] || p.mrp;
                      return (
                        <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="py-2 px-3">{p.name}</td>
                          <td className="py-2 px-3 text-right font-mono">₹{rate}</td>
                          <td className="py-2 px-3 text-center"><Input type="number" className="w-20 mx-auto text-center" value={qty || ""} onChange={(e) => updateQty(p.id, parseInt(e.target.value) || 0)} /></td>
                          <td className="py-2 px-3 text-center text-muted-foreground">{qty > 0 ? Math.ceil(qty / p.packetsPerCrate) : 0}</td>
                          <td className="py-2 px-3 text-right font-mono">{qty > 0 ? `₹${(qty * rate).toFixed(2)}` : "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                      {orderItems.map((item) => (
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
                    <Button className="w-full mt-4" onClick={() => toast.success("Indent placed (mock)")}>Place Indent</Button>
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
          <div className="space-y-3">
            <div><Label>Username</Label><Input placeholder="Username" /></div>
            <div><Label>Password</Label><Input type="password" placeholder="Password" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReset(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { toast.success("Indents reset (mock)"); setShowReset(false); }}>Confirm Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecordIndentsPage;
