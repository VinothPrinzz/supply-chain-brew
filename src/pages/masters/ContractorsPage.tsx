import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { contractors, routes } from "@/data/mockData";
import { Plus, Edit, Search } from "lucide-react";
import { toast } from "sonner";

interface Props { tab?: "list" | "new"; }

const ContractorsPage = ({ tab = "list" }: Props) => {
  const [search, setSearch] = useState("");

  const filtered = contractors.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.vehicleNo.toLowerCase().includes(search.toLowerCase())
  );

  if (tab === "new") {
    return (
      <div>
        <PageHeader title="New Contractor" description="Add a new contractor" />
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
              <div><Label>Contractor Name</Label><Input placeholder="Name" /></div>
              <div><Label>Contact</Label><Input placeholder="Phone" /></div>
              <div><Label>Vehicle No.</Label><Input placeholder="KA-XX-XX-XXXX" /></div>
              <div className="md:col-span-2"><Label>Address</Label><Input placeholder="Address" /></div>
              <div className="flex items-center gap-2 pt-2"><Switch defaultChecked /><Label>Active</Label></div>
            </div>
            <div className="mt-6"><Button onClick={() => toast.success("Contractor saved (mock)")}><Plus className="h-4 w-4 mr-1" /> Save</Button></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="All Contractors" description="View and manage contractors" />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Contractors</CardTitle>
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
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Contact</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Vehicle No.</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Address</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Assigned Routes</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((ct) => {
                  const assignedRoutes = routes.filter((r) => ct.assignedRouteIds.includes(r.id));
                  return (
                    <tr key={ct.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2 px-3 font-medium">{ct.name}</td>
                      <td className="py-2 px-3">{ct.contact}</td>
                      <td className="py-2 px-3 font-mono text-xs">{ct.vehicleNo}</td>
                      <td className="py-2 px-3 text-muted-foreground">{ct.address}</td>
                      <td className="py-2 px-3">
                        <div className="flex flex-wrap gap-1">
                          {assignedRoutes.map((r) => (
                            <span key={r.id} className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">{r.name}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${ct.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{ct.status}</span>
                      </td>
                      <td className="py-2 px-3"><Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button></td>
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

export default ContractorsPage;
