import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/DataTable";
import { fetchPriceRevisions, fetchProducts, createPriceRevision, cancelPriceRevision, getRateCategories } from "@/services/api";
import { priceRevisionSchema, type PriceRevisionFormData } from "@/lib/validations";
import type { PriceRevision } from "@/data/mockData";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const statusOf = (pr: PriceRevision): "Scheduled" | "Active" | "Expired" => {
  const now = new Date().toISOString().slice(0, 16);
  if (pr.effectiveFrom > now) return "Scheduled";
  if (pr.effectiveUntil && pr.effectiveUntil < now) return "Expired";
  return "Active";
};

const PriceRevisionsPage = () => {
  const qc = useQueryClient();
  const [tab, setTab] = useState("list");
  const { data: revisions = [] } = useQuery({ queryKey: ["priceRevisions"], queryFn: fetchPriceRevisions });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  const cancelMut = useMutation({
    mutationFn: cancelPriceRevision,
    onSuccess: () => { toast.success("Revision cancelled"); qc.invalidateQueries({ queryKey: ["priceRevisions"] }); },
  });

  const columns = useMemo<ColumnDef<PriceRevision>[]>(() => [
    { accessorKey: "id", header: "ID" },
    { id: "product", header: "Product", cell: ({ row }) => products.find(p => p.id === row.original.productId)?.name || row.original.productId },
    { accessorKey: "field", header: "Field", cell: ({ row }) => (
      <span>{row.original.field}{row.original.rateCategory ? ` · ${row.original.rateCategory}` : ""}</span>
    )},
    { accessorKey: "oldValue", header: "Old", cell: ({ row }) => <span className="font-mono">{row.original.oldValue}</span> },
    { accessorKey: "newValue", header: "New", cell: ({ row }) => <span className="font-mono font-semibold">{row.original.newValue}</span> },
    { accessorKey: "effectiveFrom", header: "Effective From" },
    { id: "status", header: "Status", cell: ({ row }) => {
      const s = statusOf(row.original);
      const cls = s === "Scheduled" ? "bg-warning/10 text-warning" : s === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground";
      return <span className={`text-xs px-2 py-0.5 rounded ${cls}`}>{s}</span>;
    }},
    { accessorKey: "createdBy", header: "Created By" },
    { id: "action", header: "", cell: ({ row }) => statusOf(row.original) === "Scheduled" ? (
      <Button size="sm" variant="ghost" onClick={() => cancelMut.mutate(row.original.id)}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    ) : null },
  ], [products, cancelMut]);

  return (
    <div>
      <PageHeader title="Price Revisions" description="Schedule MRP, rate-category, or GST changes with effective dates" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="list">All Revisions</TabsTrigger>
          <TabsTrigger value="new">New Revision</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card><CardContent className="pt-6">
            <DataTable columns={columns} data={revisions} />
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="new">
          <NewRevisionForm products={products} onSaved={() => setTab("list")} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

function NewRevisionForm({ products, onSaved }: { products: { id: string; name: string }[]; onSaved: () => void }) {
  const qc = useQueryClient();
  const form = useForm<PriceRevisionFormData>({
    resolver: zodResolver(priceRevisionSchema),
    defaultValues: { productId: "", field: "MRP", newValue: 0, effectiveFrom: "", reason: "" },
  });
  const field = form.watch("field");
  const mut = useMutation({
    mutationFn: (d: PriceRevisionFormData) => createPriceRevision(d),
    onSuccess: () => { toast.success("Price revision scheduled"); qc.invalidateQueries({ queryKey: ["priceRevisions"] }); form.reset(); onSaved(); },
  });
  const cats = getRateCategories();

  return (
    <Card><CardHeader><CardTitle className="text-base">New Price Revision</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(d => mut.mutate(d))} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium">Product *</label>
            <Select value={form.watch("productId")} onValueChange={(v) => form.setValue("productId", v)}>
              <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
              <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium">Field *</label>
            <Select value={field} onValueChange={(v) => form.setValue("field", v as PriceRevisionFormData["field"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MRP">MRP</SelectItem>
                <SelectItem value="RateCategory">Rate Category Price</SelectItem>
                <SelectItem value="GST">GST %</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {field === "RateCategory" && (
            <div>
              <label className="text-xs font-medium">Rate Category *</label>
              <Select value={form.watch("rateCategory") || ""} onValueChange={(v) => form.setValue("rateCategory", v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{cats.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          <div>
            <label className="text-xs font-medium">New Value *</label>
            <Input type="number" step="0.01" {...form.register("newValue")} />
          </div>
          <div>
            <label className="text-xs font-medium">Effective From *</label>
            <Input type="datetime-local" {...form.register("effectiveFrom")} />
          </div>
          <div>
            <label className="text-xs font-medium">Effective Until (optional)</label>
            <Input type="datetime-local" {...form.register("effectiveUntil")} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium">Reason *</label>
            <Textarea rows={2} {...form.register("reason")} />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={mut.isPending}>{mut.isPending ? "Saving..." : "Schedule Revision"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default PriceRevisionsPage;
