import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { products, stockEntries } from "@/data/mockData";
import { Lock, Save } from "lucide-react";
import { toast } from "sonner";

const StockEntryPage = () => {
  const [date, setDate] = useState("2026-04-08");
  const [showAuth, setShowAuth] = useState(false);
  const [locked, setLocked] = useState(false);

  // Table-based stock entry: each row is a product
  const [entries, setEntries] = useState<Record<string, { received: number; dispatch: number; wastage: number }>>(() => {
    const init: Record<string, { received: number; dispatch: number; wastage: number }> = {};
    products.forEach((p) => {
      const dayEntries = stockEntries.filter((s) => s.productId === p.id && s.date === date);
      const received = dayEntries.filter((s) => s.type === "Production").reduce((sum, s) => sum + s.quantity, 0);
      const dispatch = Math.abs(dayEntries.filter((s) => s.type === "Dispatch").reduce((sum, s) => sum + s.quantity, 0));
      const wastage = Math.abs(dayEntries.filter((s) => s.type === "Wastage").reduce((sum, s) => sum + s.quantity, 0));
      init[p.id] = { received, dispatch, wastage };
    });
    return init;
  });

  const updateEntry = (pid: string, field: "received" | "dispatch" | "wastage", val: number) => {
    if (locked) return;
    setEntries((prev) => ({ ...prev, [pid]: { ...prev[pid], [field]: val } }));
  };

  const handleSave = () => setShowAuth(true);

  const handleConfirmSave = () => {
    toast.success("Stock entries saved (mock)");
    setShowAuth(false);
  };

  const handleLock = () => {
    setLocked(!locked);
    toast.info(locked ? "Entries unlocked" : "Entries locked");
  };

  const recentEntries = [...stockEntries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);

  return (
    <div>
      <PageHeader title="Stock Entry" description="Record stock received, dispatched, or adjusted" />
      <Tabs defaultValue="entry">
        <TabsList className="mb-4">
          <TabsTrigger value="entry">Stock Entry</TabsTrigger>
          <TabsTrigger value="history">Recent Entries</TabsTrigger>
        </TabsList>

        <TabsContent value="entry">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-base">Daily Stock Entry</CardTitle>
                  <div><Label className="sr-only">Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" /></div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleLock}>
                    <Lock className="h-4 w-4 mr-1" /> {locked ? "Unlock" : "Lock"}
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={locked}>
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Product</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Category</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Opening</th>
                    <th className="text-center py-2 px-3 font-medium text-muted-foreground">Received</th>
                    <th className="text-center py-2 px-3 font-medium text-muted-foreground">Dispatch</th>
                    <th className="text-center py-2 px-3 font-medium text-muted-foreground">Wastage</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Closing</th>
                  </tr></thead>
                  <tbody>
                    {products.filter((p) => !p.terminated).map((p) => {
                      const e = entries[p.id] || { received: 0, dispatch: 0, wastage: 0 };
                      const opening = p.stock;
                      const closing = opening + e.received - e.dispatch - e.wastage;
                      return (
                        <tr key={p.id} className={`border-b last:border-0 hover:bg-muted/30 ${locked ? "opacity-60" : ""}`}>
                          <td className="py-2 px-3 font-medium">{p.reportAlias}</td>
                          <td className="py-2 px-3"><span className="text-xs px-1.5 py-0.5 rounded bg-secondary">{p.category}</span></td>
                          <td className="py-2 px-3 text-right font-mono">{opening}</td>
                          <td className="py-2 px-3 text-center">
                            <Input type="number" className="w-20 mx-auto text-center" value={e.received || ""} onChange={(ev) => updateEntry(p.id, "received", parseInt(ev.target.value) || 0)} disabled={locked} />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <Input type="number" className="w-20 mx-auto text-center" value={e.dispatch || ""} onChange={(ev) => updateEntry(p.id, "dispatch", parseInt(ev.target.value) || 0)} disabled={locked} />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <Input type="number" className="w-20 mx-auto text-center" value={e.wastage || ""} onChange={(ev) => updateEntry(p.id, "wastage", parseInt(ev.target.value) || 0)} disabled={locked} />
                          </td>
                          <td className={`py-2 px-3 text-right font-mono font-semibold ${closing < 0 ? "text-destructive" : ""}`}>{closing}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader><CardTitle className="text-base">Recent Stock Entries</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead><tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Qty</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Batch Ref</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Modified By</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Notes</th>
                </tr></thead>
                <tbody>
                  {recentEntries.map((e) => {
                    const prod = products.find((p) => p.id === e.productId);
                    return (
                      <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="py-2 px-3">{e.date}</td>
                        <td className="py-2 px-3">{prod?.reportAlias || e.productId}</td>
                        <td className="py-2 px-3">
                          <span className={`text-xs px-2 py-0.5 rounded ${e.type === "Production" ? "bg-success/10 text-success" : e.type === "Dispatch" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}`}>{e.type}</span>
                        </td>
                        <td className={`py-2 px-3 text-right font-mono ${e.quantity > 0 ? "text-success" : "text-destructive"}`}>{e.quantity > 0 ? "+" : ""}{e.quantity}</td>
                        <td className="py-2 px-3 font-mono text-xs">{e.batchRef || "-"}</td>
                        <td className="py-2 px-3 text-sm">{e.modifiedBy}</td>
                        <td className="py-2 px-3 text-muted-foreground">{e.notes}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent>
          <DialogHeader><DialogTitle>Authenticate to Save</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground mb-3">Enter your credentials to save stock entries.</p>
          <div className="space-y-3">
            <div><Label>Username</Label><Input placeholder="Username" /></div>
            <div><Label>Password</Label><Input type="password" placeholder="Password" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAuth(false)}>Cancel</Button>
            <Button onClick={handleConfirmSave}>Confirm & Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockEntryPage;
