import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { fetchProducts, fetchStockEntries, saveStockEntries } from "@/services/api";
import { authSchema, type AuthFormData } from "@/lib/validations";
import { Lock, Save } from "lucide-react";
import { toast } from "sonner";
import type { Product, StockEntry } from "@/data/mockData";

const StockEntryPage = () => {
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { data: stockEntries = [] } = useQuery({ queryKey: ["stockEntries"], queryFn: fetchStockEntries });

  const [date, setDate] = useState("2026-04-08");
  const [showAuth, setShowAuth] = useState(false);
  const [locked, setLocked] = useState(false);

  const authForm = useForm<AuthFormData>({ resolver: zodResolver(authSchema) });

  const [entries, setEntries] = useState<Record<string, { received: number; dispatch: number; wastage: number }>>(() => {
    const init: Record<string, { received: number; dispatch: number; wastage: number }> = {};
    products.forEach(p => {
      const dayEntries = stockEntries.filter(s => s.productId === p.id && s.date === date);
      const received = dayEntries.filter(s => s.type === "Production").reduce((sum, s) => sum + s.quantity, 0);
      const dispatch = Math.abs(dayEntries.filter(s => s.type === "Dispatch").reduce((sum, s) => sum + s.quantity, 0));
      const wastage = Math.abs(dayEntries.filter(s => s.type === "Wastage").reduce((sum, s) => sum + s.quantity, 0));
      init[p.id] = { received, dispatch, wastage };
    });
    return init;
  });

  const updateEntry = (pid: string, field: "received" | "dispatch" | "wastage", val: number) => {
    if (locked) return;
    setEntries(prev => ({ ...prev, [pid]: { ...prev[pid], [field]: val } }));
  };

  const saveMutation = useMutation({
    mutationFn: (data: AuthFormData) => saveStockEntries(entries, date, data.username, data.password),
    onSuccess: () => { toast.success("Stock entries saved successfully"); setShowAuth(false); authForm.reset(); },
  });

  const recentColumns = useMemo<ColumnDef<StockEntry>[]>(() => [
    { accessorKey: "date", header: "Date" },
    { id: "product", header: "Product", cell: ({ row }) => products.find(p => p.id === row.original.productId)?.reportAlias || row.original.productId },
    { accessorKey: "type", header: "Type", cell: ({ row }) => (
      <span className={`text-xs px-2 py-0.5 rounded ${row.original.type === "Production" ? "bg-success/10 text-success" : row.original.type === "Dispatch" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}`}>{row.original.type}</span>
    )},
    { accessorKey: "quantity", header: "Qty", cell: ({ row }) => <span className={`font-mono ${row.original.quantity > 0 ? "text-success" : "text-destructive"}`}>{row.original.quantity > 0 ? "+" : ""}{row.original.quantity}</span> },
    { accessorKey: "batchRef", header: "Batch Ref", cell: ({ row }) => <span className="font-mono text-xs">{row.original.batchRef || "-"}</span> },
    { accessorKey: "modifiedBy", header: "Modified By" },
    { accessorKey: "notes", header: "Notes", cell: ({ row }) => <span className="text-muted-foreground">{row.original.notes}</span> },
  ], [products]);

  const recentEntries = useMemo(() => [...stockEntries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20), [stockEntries]);

  return (
    <div>
      <PageHeader title="Stock Entry" description="Record stock received, dispatched, or adjusted" />

      {/* Entry Table */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-base">Daily Stock Entry</CardTitle>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-40" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setLocked(!locked); toast.info(locked ? "Entries unlocked" : "Entries locked"); }}>
                <Lock className="h-4 w-4 mr-1" /> {locked ? "Unlock" : "Lock"}
              </Button>
              <Button size="sm" onClick={() => setShowAuth(true)} disabled={locked}>
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-md border">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/30">
                <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Product</th>
                <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Category</th>
                <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Opening</th>
                <th className="text-center py-2.5 px-3 font-medium text-muted-foreground">Received</th>
                <th className="text-center py-2.5 px-3 font-medium text-muted-foreground">Dispatch</th>
                <th className="text-center py-2.5 px-3 font-medium text-muted-foreground">Wastage</th>
                <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Closing</th>
              </tr></thead>
              <tbody>
                {products.filter(p => !p.terminated).map(p => {
                  const e = entries[p.id] || { received: 0, dispatch: 0, wastage: 0 };
                  const opening = p.stock;
                  const closing = opening + e.received - e.dispatch - e.wastage;
                  return (
                    <tr key={p.id} className={`border-b last:border-0 hover:bg-muted/30 ${locked ? "opacity-60" : ""}`}>
                      <td className="py-2 px-3 font-medium">{p.reportAlias}</td>
                      <td className="py-2 px-3"><span className="text-xs px-1.5 py-0.5 rounded bg-secondary">{p.category}</span></td>
                      <td className="py-2 px-3 text-right font-mono">{opening}</td>
                      <td className="py-2 px-3 text-center"><Input type="number" className="w-20 mx-auto text-center" value={e.received || ""} onChange={ev => updateEntry(p.id, "received", parseInt(ev.target.value) || 0)} disabled={locked} /></td>
                      <td className="py-2 px-3 text-center"><Input type="number" className="w-20 mx-auto text-center" value={e.dispatch || ""} onChange={ev => updateEntry(p.id, "dispatch", parseInt(ev.target.value) || 0)} disabled={locked} /></td>
                      <td className="py-2 px-3 text-center"><Input type="number" className="w-20 mx-auto text-center" value={e.wastage || ""} onChange={ev => updateEntry(p.id, "wastage", parseInt(ev.target.value) || 0)} disabled={locked} /></td>
                      <td className={`py-2 px-3 text-right font-mono font-semibold ${closing < 0 ? "text-destructive" : ""}`}>{closing}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader><CardTitle className="text-base">Recent Stock Entries</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={recentColumns} data={recentEntries} showSearch={false} pageSize={10} />
        </CardContent>
      </Card>

      {/* Auth Dialog */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent>
          <DialogHeader><DialogTitle>Authenticate to Save</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground mb-3">Enter your credentials to save stock entries.</p>
          <Form {...authForm}>
            <form onSubmit={authForm.handleSubmit(data => saveMutation.mutate(data))}>
              <div className="space-y-3">
                <FormField control={authForm.control} name="username" render={({ field }) => (
                  <FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="Username" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={authForm.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="Password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" type="button" onClick={() => setShowAuth(false)}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? "Saving..." : "Confirm & Save"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockEntryPage;
