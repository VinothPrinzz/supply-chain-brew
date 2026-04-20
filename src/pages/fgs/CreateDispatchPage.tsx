import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { dispatchCreateSchema, type DispatchCreateFormData } from "@/lib/validations";
import { fetchRoutes, fetchBatches, fetchIndents, fetchContractors, fetchProducts, createDispatch } from "@/services/api";
import { toast } from "sonner";

const CreateDispatchPage = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const { data: routes = [] } = useQuery({ queryKey: ["routes"], queryFn: fetchRoutes });
  const { data: batches = [] } = useQuery({ queryKey: ["batches"], queryFn: fetchBatches });
  const { data: indents = [] } = useQuery({ queryKey: ["indents"], queryFn: fetchIndents });
  const { data: contractors = [] } = useQuery({ queryKey: ["contractors"], queryFn: fetchContractors });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  const form = useForm<DispatchCreateFormData>({
    resolver: zodResolver(dispatchCreateSchema),
    defaultValues: {
      date: "2026-04-08", routeId: "", batchId: "",
      dispatchTime: "", vehicleNo: "", driverName: "", notes: "",
    },
  });

  const date = form.watch("date");
  const routeId = form.watch("routeId");
  const batchId = form.watch("batchId");

  // Auto-fill dispatch time + vehicle no when route changes
  const onRouteChange = (val: string) => {
    form.setValue("routeId", val);
    const r = routes.find(x => x.id === val);
    if (r) {
      form.setValue("dispatchTime", r.dispatchTime);
      const c = contractors.find(c => c.id === r.contractorId);
      if (c) form.setValue("vehicleNo", c.vehicleNo);
    }
  };

  const eligibleIndents = useMemo(() =>
    indents.filter(i => i.date === date && i.routeId === routeId && i.batchId === batchId && i.status === "Pending"),
    [indents, date, routeId, batchId]
  );

  const totals = useMemo(() => {
    const chosen = eligibleIndents.filter(i => selected[i.id]);
    let amount = 0, packets = 0, crates = 0;
    chosen.forEach(i => {
      amount += i.totalAmount;
      i.items.forEach(it => {
        const p = products.find(pp => pp.id === it.productId);
        packets += it.quantity;
        if (p?.packetsPerCrate) crates += Math.floor(it.quantity / p.packetsPerCrate);
      });
    });
    return { count: chosen.length, amount, packets, crates };
  }, [eligibleIndents, selected, products]);

  const mut = useMutation({
    mutationFn: async (data: DispatchCreateFormData) => {
      const indentIds = eligibleIndents.filter(i => selected[i.id]).map(i => i.id);
      if (indentIds.length === 0) throw new Error("Select at least one indent");
      return createDispatch({
        date: data.date, routeId: data.routeId, dispatchTime: data.dispatchTime,
        totalCrates: totals.crates, indentIds,
      });
    },
    onSuccess: () => {
      toast.success("Dispatch created");
      qc.invalidateQueries({ queryKey: ["dispatches"] });
      navigate("/fgs/dispatch-sheet");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader title="Create Dispatch" description="Build a new route dispatch from pending indents" />

      <form onSubmit={form.handleSubmit((d) => mut.mutate(d))} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">Dispatch Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium">Date</label>
              <Input type="date" {...form.register("date")} />
            </div>
            <div>
              <label className="text-xs font-medium">Route *</label>
              <Select value={routeId} onValueChange={onRouteChange}>
                <SelectTrigger><SelectValue placeholder="Select route" /></SelectTrigger>
                <SelectContent>
                  {routes.filter(r => r.status === "Active").map(r => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.routeId && <p className="text-xs text-destructive mt-1">{form.formState.errors.routeId.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium">Batch *</label>
              <Select value={batchId} onValueChange={(v) => form.setValue("batchId", v)}>
                <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                <SelectContent>
                  {batches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {form.formState.errors.batchId && <p className="text-xs text-destructive mt-1">{form.formState.errors.batchId.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium">Dispatch Time</label>
              <Input {...form.register("dispatchTime")} placeholder="e.g. 5:30 AM" />
            </div>
            <div>
              <label className="text-xs font-medium">Vehicle No.</label>
              <Input {...form.register("vehicleNo")} />
            </div>
            <div>
              <label className="text-xs font-medium">Driver Name</label>
              <Input {...form.register("driverName")} />
            </div>
            <div>
              <label className="text-xs font-medium">Notes</label>
              <Textarea rows={2} {...form.register("notes")} />
            </div>

            <div className="border-t pt-3 grid grid-cols-2 gap-2 text-sm">
              <div><p className="text-xs text-muted-foreground">Indents</p><p className="font-mono font-semibold">{totals.count}</p></div>
              <div><p className="text-xs text-muted-foreground">Crates</p><p className="font-mono font-semibold">{totals.crates}</p></div>
              <div><p className="text-xs text-muted-foreground">Packets</p><p className="font-mono font-semibold">{totals.packets}</p></div>
              <div><p className="text-xs text-muted-foreground">Amount</p><p className="font-mono font-semibold">₹{totals.amount.toLocaleString()}</p></div>
            </div>

            <Button type="submit" className="w-full" disabled={mut.isPending}>
              {mut.isPending ? "Creating..." : "Create Dispatch"}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Pending Indents</CardTitle></CardHeader>
          <CardContent>
            {!routeId || !batchId ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Select route and batch to view pending indents.</p>
            ) : eligibleIndents.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No pending indents for selection.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-2 py-2 text-left">
                        <Checkbox
                          checked={eligibleIndents.every(i => selected[i.id])}
                          onCheckedChange={(v) => {
                            const next: Record<string, boolean> = {};
                            if (v) eligibleIndents.forEach(i => next[i.id] = true);
                            setSelected(next);
                          }}
                        />
                      </th>
                      <th className="px-2 py-2 text-left">Indent</th>
                      <th className="px-2 py-2 text-left">Customer</th>
                      <th className="px-2 py-2 text-right">Items</th>
                      <th className="px-2 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eligibleIndents.map(i => (
                      <tr key={i.id} className="border-t hover:bg-muted/30">
                        <td className="px-2 py-2">
                          <Checkbox checked={!!selected[i.id]} onCheckedChange={(v) => setSelected(prev => ({ ...prev, [i.id]: !!v }))} />
                        </td>
                        <td className="px-2 py-2 font-mono text-xs">{i.id}</td>
                        <td className="px-2 py-2">{i.customerId}</td>
                        <td className="px-2 py-2 text-right font-mono">{i.items.length}</td>
                        <td className="px-2 py-2 text-right font-mono">₹{i.totalAmount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateDispatchPage;
