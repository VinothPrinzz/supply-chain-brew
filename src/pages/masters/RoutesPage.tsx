import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { routes, contractors, customers } from "@/data/mockData";
import { Plus, Edit, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

interface Props { tab?: "list" | "new"; }

const RoutesPage = ({ tab = "list" }: Props) => {
  const [sortBy, setSortBy] = useState<string>("code");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (col: string) => {
    if (sortBy === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const sorted = [...routes].sort((a, b) => {
    const va = (a as any)[sortBy] || "";
    const vb = (b as any)[sortBy] || "";
    return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  if (tab === "new") {
    return (
      <div>
        <PageHeader title="New Route" description="Add a new delivery route" />
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
              <div><Label>Route Code</Label><Input placeholder="e.g. RT07" /></div>
              <div><Label>Route Name</Label><Input placeholder="Route name" /></div>
              <div><Label>Taluka</Label><Input placeholder="Taluka name" /></div>
              <div><Label>Contractor</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select contractor" /></SelectTrigger>
                  <SelectContent>{contractors.map((ct) => <SelectItem key={ct.id} value={ct.id}>{ct.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Dispatch Time</Label><Input placeholder="e.g. 5:30 AM" /></div>
              <div className="md:col-span-2"><Label>Description</Label><Input placeholder="Description" /></div>
            </div>
            <div className="mt-6"><Button onClick={() => toast.success("Route saved (mock)")}><Plus className="h-4 w-4 mr-1" /> Save</Button></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const SortHeader = ({ col, label }: { col: string; label: string }) => (
    <th className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort(col)}>
      <span className="flex items-center gap-1">{label}<ArrowUpDown className="h-3 w-3 opacity-40" /></span>
    </th>
  );

  return (
    <div>
      <PageHeader title="All Routes" description="View and manage delivery routes" />
      <Card>
        <CardHeader><CardTitle className="text-base">Routes</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b">
                <SortHeader col="code" label="Code" />
                <SortHeader col="name" label="Route Name" />
                <SortHeader col="taluka" label="Taluka" />
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Contractor</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Customers</th>
                <SortHeader col="dispatchTime" label="Dispatch Time" />
                <SortHeader col="status" label="Status" />
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Edit</th>
              </tr></thead>
              <tbody>
                {sorted.map((r) => {
                  const contractor = contractors.find((ct) => ct.id === r.contractorId);
                  const custCount = customers.filter((c) => c.routeId === r.id).length;
                  return (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2 px-3 font-mono">{r.code}</td>
                      <td className="py-2 px-3 font-medium">{r.name}</td>
                      <td className="py-2 px-3">{r.taluka}</td>
                      <td className="py-2 px-3">{contractor?.name || "-"}</td>
                      <td className="py-2 px-3 text-right font-mono">{custCount}</td>
                      <td className="py-2 px-3">{r.dispatchTime}</td>
                      <td className="py-2 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${r.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{r.status}</span>
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

export default RoutesPage;
