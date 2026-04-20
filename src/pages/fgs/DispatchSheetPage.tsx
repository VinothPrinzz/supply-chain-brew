import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { fetchDispatchEntries, fetchRoutes, fetchIndents, fetchProducts, fetchContractors, fetchBatches, dispatchRoute } from "@/services/api";
import { Send, Printer, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const todayIso = new Date().toISOString().slice(0, 10);

const DispatchSheetPage = () => {
  const qc = useQueryClient();
  const [date, setDate] = useState("2026-04-08");
  const [routeFilter, setRouteFilter] = useState<string>("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [verified, setVerified] = useState<Record<string, boolean>>({});

  const { data: dispatches = [] } = useQuery({ queryKey: ["dispatches"], queryFn: fetchDispatchEntries });
  const { data: routes = [] } = useQuery({ queryKey: ["routes"], queryFn: fetchRoutes });
  const { data: indents = [] } = useQuery({ queryKey: ["indents"], queryFn: fetchIndents });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { data: contractors = [] } = useQuery({ queryKey: ["contractors"], queryFn: fetchContractors });
  const { data: batches = [] } = useQuery({ queryKey: ["batches"], queryFn: fetchBatches });

  const dispatchMut = useMutation({
    mutationFn: (id: string) => dispatchRoute(id),
    onSuccess: () => { toast.success("Route marked dispatched"); qc.invalidateQueries({ queryKey: ["dispatches"] }); },
  });

  const filteredDispatches = useMemo(() => dispatches.filter(d =>
    d.date === date &&
    (routeFilter === "all" || d.routeId === routeFilter)
  ), [dispatches, date, routeFilter]);

  const productMap = useMemo(() => Object.fromEntries(products.map(p => [p.id, p])), [products]);

  const aggByRoute = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    indents
      .filter(i => i.date === date && (batchFilter === "all" || i.batchId === batchFilter))
      .forEach(i => {
        if (!map[i.routeId]) map[i.routeId] = {};
        i.items.forEach(it => {
          map[i.routeId][it.productId] = (map[i.routeId][it.productId] || 0) + it.quantity;
        });
      });
    return map;
  }, [indents, date, batchFilter]);

  const summary = useMemo(() => {
    let totalPackets = 0, totalCrates = 0, items = 0;
    filteredDispatches.forEach(d => {
      const agg = aggByRoute[d.routeId] || {};
      Object.entries(agg).forEach(([pid, qty]) => {
        items++;
        totalPackets += qty;
        const p = productMap[pid];
        if (p?.packetsPerCrate) totalCrates += Math.floor(qty / p.packetsPerCrate);
      });
    });
    return { items, totalPackets, totalCrates, routes: filteredDispatches.length };
  }, [filteredDispatches, aggByRoute, productMap]);

  return (
    <div>
      <PageHeader
        title="Dispatch Sheet"
        description="Loading checklist for dispatch personnel"
        actions={
          <Button asChild size="sm">
            <Link to="/fgs/dispatch/create"><Plus className="h-4 w-4 mr-1" /> Create Dispatch</Link>
          </Button>
        }
      />

      {/* Filter bar */}
      <Card className="mb-4">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Date</label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Route</label>
            <Select value={routeFilter} onValueChange={setRouteFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                {routes.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Batch</label>
            <Select value={batchFilter} onValueChange={setBatchFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {batches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" size="sm" className="w-full" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-1" /> Print Full Sheet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: "Items", value: summary.items },
          { label: "Total Packets", value: summary.totalPackets },
          { label: "Total Crates", value: summary.totalCrates },
          { label: "Routes", value: summary.routes },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold font-mono">{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      {filteredDispatches.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No dispatches for selected filters.</CardContent></Card>
      ) : (
        <Accordion type="multiple" className="space-y-3" defaultValue={filteredDispatches.map(d => d.id)}>
          {filteredDispatches.map(d => {
            const route = routes.find(r => r.id === d.routeId);
            const contractor = contractors.find(c => c.id === route?.contractorId);
            const agg = aggByRoute[d.routeId] || {};
            const rows = Object.entries(agg)
              .map(([pid, qty]) => {
                const p = productMap[pid];
                const ppc = p?.packetsPerCrate || 0;
                return {
                  pid, name: p?.name || pid, category: p?.category || "-",
                  pack: p ? `${p.packSize}${p.unit}` : "-",
                  qty, ppc,
                  crates: ppc ? Math.floor(qty / ppc) : 0,
                  loose: ppc ? qty % ppc : qty,
                };
              })
              .sort((a, b) => (productMap[a.pid]?.sortPosition || 0) - (productMap[b.pid]?.sortPosition || 0));
            const totalPackets = rows.reduce((s, r) => s + r.qty, 0);
            const totalCrates = rows.reduce((s, r) => s + r.crates, 0);

            return (
              <AccordionItem key={d.id} value={d.id} className="border rounded-md bg-card">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex flex-1 items-center justify-between pr-3">
                    <div className="text-left">
                      <p className="font-semibold">{route?.name || d.routeId}</p>
                      <p className="text-xs text-muted-foreground">
                        {contractor?.name} · {contractor?.vehicleNo} · {d.dispatchTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{rows.length} items</span>
                      <span className="font-mono text-sm">{totalCrates} crates</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${d.status === "Dispatched" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{d.status}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {rows.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No items to load on this route.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left px-2 py-2 font-semibold">Product</th>
                            <th className="text-left px-2 py-2 font-semibold">Category</th>
                            <th className="text-left px-2 py-2 font-semibold">Pack</th>
                            <th className="text-right px-2 py-2 font-semibold">Total Packets</th>
                            <th className="text-right px-2 py-2 font-semibold">Pkts/Crate</th>
                            <th className="text-right px-2 py-2 font-semibold">Crates</th>
                            <th className="text-right px-2 py-2 font-semibold">Loose</th>
                            <th className="text-center px-2 py-2 font-semibold">Verified</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map(r => {
                            const key = `${d.id}:${r.pid}`;
                            return (
                              <tr key={key} className="border-t">
                                <td className="px-2 py-2 font-medium">{r.name}</td>
                                <td className="px-2 py-2">{r.category}</td>
                                <td className="px-2 py-2">{r.pack}</td>
                                <td className="px-2 py-2 text-right font-mono">{r.qty}</td>
                                <td className="px-2 py-2 text-right font-mono text-muted-foreground">{r.ppc}</td>
                                <td className="px-2 py-2 text-right font-mono font-semibold">{r.crates}</td>
                                <td className="px-2 py-2 text-right font-mono">{r.loose}</td>
                                <td className="px-2 py-2 text-center">
                                  <Checkbox checked={!!verified[key]} onCheckedChange={(v) => setVerified(prev => ({ ...prev, [key]: !!v }))} />
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="border-t bg-muted/30 font-semibold">
                            <td colSpan={3} className="px-2 py-2 text-right">Total</td>
                            <td className="px-2 py-2 text-right font-mono">{totalPackets}</td>
                            <td></td>
                            <td className="px-2 py-2 text-right font-mono">{totalCrates}</td>
                            <td colSpan={2}></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="flex justify-end gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                      <Printer className="h-4 w-4 mr-1" /> Print Loading Slip
                    </Button>
                    {d.status === "Pending" && d.totalIndents > 0 && (
                      <Button size="sm" onClick={() => dispatchMut.mutate(d.id)} disabled={dispatchMut.isPending}>
                        <Send className="h-4 w-4 mr-1" /> Mark Dispatched
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
};

export default DispatchSheetPage;
