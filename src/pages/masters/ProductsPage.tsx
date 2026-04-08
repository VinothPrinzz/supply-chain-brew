import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products, rateCategories } from "@/data/mockData";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.code.includes(search)
  );

  return (
    <div>
      <PageHeader title="Products / Packets" description="Manage milk products, packets, and rate categories" />
      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Product List</TabsTrigger>
          <TabsTrigger value="new">Add Packet</TabsTrigger>
          <TabsTrigger value="rates">Rate Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">All Products</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-48" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Code</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Category</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">MRP</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">GST%</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">HSN</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Direction</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Status</th>
                  </tr></thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="py-2 px-2 font-mono">{p.code}</td>
                        <td className="py-2 px-2 font-medium">{p.name}</td>
                        <td className="py-2 px-2">{p.category}</td>
                        <td className="py-2 px-2 text-right">₹{p.mrp}</td>
                        <td className="py-2 px-2 text-right">{p.gstPercent}%</td>
                        <td className="py-2 px-2 font-mono">{p.hsnNo}</td>
                        <td className="py-2 px-2"><span className={`text-xs px-1.5 py-0.5 rounded ${p.printDirection === "Across" ? "bg-primary/10 text-primary" : "bg-secondary"}`}>{p.printDirection}</span></td>
                        <td className="py-2 px-2">{p.terminated ? <span className="text-xs text-destructive">Terminated</span> : <span className="text-xs text-success">Active</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader><CardTitle className="text-base">Add New Packet</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div><Label>Packet Code (Auto)</Label><Input value={`00${products.length + 1}`} disabled className="bg-muted" /></div>
                <div><Label>Packet Name</Label><Input placeholder="Product name" /></div>
                <div><Label>Report Alias</Label><Input placeholder="Short name for reports" /></div>
                <div><Label>Product Category</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["Milk", "Curd", "Buttermilk", "Lassi", "Ghee", "Sweets", "Paneer", "Other"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Pack Size</Label><Input type="number" placeholder="0.5" /></div>
                <div><Label>Unit</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem><SelectItem value="ltr">ltr</SelectItem><SelectItem value="pcs">pcs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>MRP (₹)</Label><Input type="number" placeholder="0" /></div>
                <div><Label>GST %</Label><Input type="number" placeholder="0" /></div>
                <div><Label>CGST</Label><Input type="number" placeholder="0" /></div>
                <div><Label>SGST</Label><Input type="number" placeholder="0" /></div>
                <div><Label>HSN No.</Label><Input placeholder="HSN" /></div>
                <div className="flex items-center gap-2 pt-5"><Switch /><Label>Subsidy</Label></div>
                <div><Label>Sub Rate</Label><Input type="number" placeholder="0" /></div>
                <div className="flex items-center gap-2 pt-5"><Switch /><Label>Indent in Box</Label></div>
                <div><Label>Box Qty</Label><Input type="number" placeholder="0" /></div>
                <div><Label>Sort Position</Label><Input type="number" placeholder="0" /></div>
                <div className="flex items-center gap-2 pt-5"><Switch /><Label>Make Zero in Indents</Label></div>
                <div><Label>Packets/Crate</Label><Input type="number" placeholder="0" /></div>
                <div><Label>Print Direction</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Across">Across</SelectItem><SelectItem value="Down">Down</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-5"><Switch /><Label>Terminated</Label></div>
              </div>
              <div className="mt-6"><Button onClick={() => toast.success("Product saved (mock)")}><Plus className="h-4 w-4 mr-1" /> Save Product</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates">
          <Card>
            <CardHeader><CardTitle className="text-base">Rate Categories</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Product</th>
                    {rateCategories.map((rc) => <th key={rc} className="text-right py-2 px-3 font-medium text-muted-foreground">{rc}</th>)}
                  </tr></thead>
                  <tbody>
                    {products.filter((p) => !p.terminated).map((p) => (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="py-2 px-3 font-medium">{p.name}</td>
                        {rateCategories.map((rc) => <td key={rc} className="py-2 px-3 text-right font-mono">₹{p.rateCategories[rc] || "-"}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductsPage;
