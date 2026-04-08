import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { agents, products, customers } from "@/data/mockData";
import { toast } from "sonner";

const DirectSalesPage = () => {
  const activeProducts = products.filter((p) => !p.terminated);

  return (
    <div>
      <PageHeader title="Direct Sales" description="Adhoc sales, gate pass, and indent modifications" />
      <Tabs defaultValue="gate-pass">
        <TabsList className="mb-4">
          <TabsTrigger value="gate-pass">Gate Pass (Agents)</TabsTrigger>
          <TabsTrigger value="cash-customer">Cash Customer</TabsTrigger>
          <TabsTrigger value="modify">Modify Indent</TabsTrigger>
        </TabsList>

        <TabsContent value="gate-pass">
          <Card>
            <CardHeader><CardTitle className="text-base">Adhoc Sales — Gate Pass</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-end mb-6">
                <div><Label>Agent</Label>
                  <Select><SelectTrigger className="w-52"><SelectValue placeholder="Select agent" /></SelectTrigger>
                    <SelectContent>{agents.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} — {a.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Date</Label><Input type="date" defaultValue="2026-04-08" className="w-44" /></div>
              </div>
              <table className="w-full text-sm mb-4">
                <thead><tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Product</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground">Qty</th>
                </tr></thead>
                <tbody>
                  {activeProducts.slice(0, 4).map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2 px-3">{p.name}</td>
                      <td className="py-2 px-3 text-center"><Input type="number" className="w-20 mx-auto text-center" defaultValue="0" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button onClick={() => toast.success("Gate pass generated (mock)")}>Generate Gate Pass</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-customer">
          <Card>
            <CardHeader><CardTitle className="text-base">Cash Customer Sale</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-end mb-6">
                <div><Label>Customer</Label>
                  <Select><SelectTrigger className="w-52"><SelectValue placeholder="Select customer" /></SelectTrigger>
                    <SelectContent>{customers.filter((c) => c.payMode === "Cash").map((c) => <SelectItem key={c.id} value={c.id}>{c.code} — {c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Date</Label><Input type="date" defaultValue="2026-04-08" className="w-44" /></div>
              </div>
              <table className="w-full text-sm mb-4">
                <thead><tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Product</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground">Qty</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Amount</th>
                </tr></thead>
                <tbody>
                  {activeProducts.slice(0, 4).map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2 px-3">{p.name}</td>
                      <td className="py-2 px-3 text-center"><Input type="number" className="w-20 mx-auto text-center" defaultValue="0" /></td>
                      <td className="py-2 px-3 text-right font-mono">₹0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button onClick={() => toast.success("Sale recorded (mock)")}>Save Sale</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modify">
          <Card>
            <CardHeader><CardTitle className="text-base">Modify Indent</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Search for an existing indent to modify.</p>
              <div className="flex gap-3 mt-3 items-end">
                <div><Label>Indent ID</Label><Input placeholder="e.g. IND1" className="w-40" /></div>
                <Button variant="outline">Search</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DirectSalesPage;
