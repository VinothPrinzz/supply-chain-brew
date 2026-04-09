import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { customers, routes, rateCategories, officers } from "@/data/mockData";
import { Plus, Search, Edit, Eye } from "lucide-react";
import { toast } from "sonner";

interface Props { tab?: "list" | "new" | "assign-route"; }

const CustomersPage = ({ tab = "list" }: Props) => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedRoute, setSelectedRoute] = useState("");

  const filtered = customers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || c.type === filterType;
    return matchSearch && matchType;
  });

  const routeCustomers = selectedRoute ? customers.filter((c) => c.routeId === selectedRoute && c.status === "Active") : [];

  if (tab === "new") {
    return (
      <div>
        <PageHeader title="New Customer" description="Add a new customer" />
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
              <div><Label>Customer Code (Auto)</Label><Input value={`A${customers.length + 1}`} disabled className="bg-muted" /></div>
              <div><Label>Customer Name</Label><Input placeholder="Enter customer name" /></div>
              <div><Label>Customer Type</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Retail-Dealer">Retail-Dealer</SelectItem>
                    <SelectItem value="Credit Inst-MRP">Credit Institution-MRP</SelectItem>
                    <SelectItem value="Credit Inst-Dealer">Credit Institution-Dealer</SelectItem>
                    <SelectItem value="Parlour-Dealer">Parlour-Dealer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Rate Category</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select rate" /></SelectTrigger>
                  <SelectContent>{rateCategories.map((rc) => <SelectItem key={rc} value={rc}>{rc}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Bank</Label><Input placeholder="Bank name" /></div>
              <div><Label>Pay Mode</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent><SelectItem value="Cash">Cash</SelectItem><SelectItem value="Credit">Credit</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Officer Name</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select officer" /></SelectTrigger>
                  <SelectContent>{officers.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Phone</Label><Input placeholder="Phone number" /></div>
              <div><Label>City</Label><Input placeholder="City" /></div>
              <div className="md:col-span-2"><Label>Address</Label><Input placeholder="Full address" /></div>
              <div className="flex items-center gap-2 pt-5"><Switch id="status" defaultChecked /><Label htmlFor="status">Active</Label></div>
            </div>
            <div className="mt-6"><Button onClick={() => toast.success("Customer saved (mock)")}><Plus className="h-4 w-4 mr-1" /> Save Customer</Button></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (tab === "assign-route") {
    return (
      <div>
        <PageHeader title="Assign Route" description="Assign customers to routes" />
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-3 items-end">
              <div><Label>Select Route</Label>
                <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                  <SelectTrigger className="w-64"><SelectValue placeholder="Choose route" /></SelectTrigger>
                  <SelectContent>{routes.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        {selectedRoute && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Customers on {routes.find(r => r.id === selectedRoute)?.name}</CardTitle>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Customer</Button>
              </div>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead><tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Sl</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Code</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Phone</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Actions</th>
                </tr></thead>
                <tbody>
                  {routeCustomers.map((c, idx) => (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2 px-3">{idx + 1}</td>
                      <td className="py-2 px-3 font-mono">{c.code}</td>
                      <td className="py-2 px-3 font-medium">{c.name}</td>
                      <td className="py-2 px-3"><span className="text-xs px-2 py-0.5 rounded bg-secondary">{c.type}</span></td>
                      <td className="py-2 px-3">{c.phone}</td>
                      <td className="py-2 px-3"><Button variant="ghost" size="sm" className="text-destructive h-7">Remove</Button></td>
                    </tr>
                  ))}
                  {routeCustomers.length === 0 && <tr><td colSpan={6} className="py-4 text-center text-muted-foreground">No customers assigned to this route</td></tr>}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="All Customers" description="View and manage all customers" />
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <CardTitle className="text-base">Customer List</CardTitle>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-48" />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Retail-Dealer">Retail-Dealer</SelectItem>
                  <SelectItem value="Credit Inst-MRP">Credit Inst-MRP</SelectItem>
                  <SelectItem value="Credit Inst-Dealer">Credit Inst-Dealer</SelectItem>
                  <SelectItem value="Parlour-Dealer">Parlour-Dealer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Code</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Route</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Pay Mode</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((c) => {
                  const route = routes.find((r) => r.id === c.routeId);
                  return (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2 px-3 font-mono">{c.code}</td>
                      <td className="py-2 px-3 font-medium">{c.name}</td>
                      <td className="py-2 px-3"><span className="text-xs px-2 py-0.5 rounded bg-secondary">{c.type}</span></td>
                      <td className="py-2 px-3">{route?.name || "-"}</td>
                      <td className="py-2 px-3">{c.payMode}</td>
                      <td className="py-2 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${c.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{c.status}</span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                        </div>
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

export default CustomersPage;
