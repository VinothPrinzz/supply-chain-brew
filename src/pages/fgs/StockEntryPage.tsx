import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products, stockEntries } from "@/data/mockData";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const StockEntryPage = () => {
  const recentEntries = [...stockEntries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);

  return (
    <div>
      <PageHeader title="Stock Entry" description="Record stock received, dispatched, or adjusted" />
      <Tabs defaultValue="new">
        <TabsList className="mb-4">
          <TabsTrigger value="new">New Entry</TabsTrigger>
          <TabsTrigger value="history">Recent Entries</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <Card>
            <CardHeader><CardTitle className="text-base">Record Stock Entry</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
                <div><Label>Product</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                    <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Type</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Production">Production (In)</SelectItem>
                      <SelectItem value="Dispatch">Dispatch (Out)</SelectItem>
                      <SelectItem value="Wastage">Wastage</SelectItem>
                      <SelectItem value="Return">Return</SelectItem>
                      <SelectItem value="Adjustment">Adjustment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Quantity</Label><Input type="number" placeholder="0" /></div>
                <div><Label>Date</Label><Input type="date" defaultValue="2026-04-08" /></div>
                <div><Label>Batch Reference</Label><Input placeholder="e.g. PRD-0408-01" /></div>
                <div><Label>Notes</Label><Input placeholder="Optional notes" /></div>
              </div>
              <div className="mt-6"><Button onClick={() => toast.success("Stock entry saved (mock)")}><Plus className="h-4 w-4 mr-1" /> Save Entry</Button></div>
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
                          <span className={`text-xs px-2 py-0.5 rounded ${e.type === "Production" ? "bg-success/10 text-success" : e.type === "Dispatch" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}`}>
                            {e.type}
                          </span>
                        </td>
                        <td className={`py-2 px-3 text-right font-mono ${e.quantity > 0 ? "text-success" : "text-destructive"}`}>{e.quantity > 0 ? "+" : ""}{e.quantity}</td>
                        <td className="py-2 px-3 font-mono text-xs">{e.batchRef || "-"}</td>
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
    </div>
  );
};

export default StockEntryPage;
