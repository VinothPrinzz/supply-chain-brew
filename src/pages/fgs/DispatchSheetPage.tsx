import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDispatchEntries, fetchRoutes, dispatchRoute } from "@/services/api";
import { Send } from "lucide-react";
import { toast } from "sonner";
import type { DispatchEntry } from "@/data/mockData";

const DispatchSheetPage = () => {
  const qc = useQueryClient();
  const [date] = useState("2026-04-08");
  const { data: dispatches = [] } = useQuery({ queryKey: ["dispatches"], queryFn: fetchDispatchEntries });
  const { data: routes = [] } = useQuery({ queryKey: ["routes"], queryFn: fetchRoutes });

  const todaysDispatches = useMemo(() => dispatches.filter(d => d.date === date), [dispatches, date]);

  const dispatchMut = useMutation({
    mutationFn: (id: string) => dispatchRoute(id),
    onSuccess: () => { toast.success("Route dispatched successfully"); qc.invalidateQueries({ queryKey: ["dispatches"] }); },
  });

  const columns = useMemo<ColumnDef<DispatchEntry>[]>(() => [
    { id: "route", header: "Route Name", cell: ({ row }) => <span className="font-medium">{routes.find(r => r.id === row.original.routeId)?.name || row.original.routeId}</span> },
    { accessorKey: "totalIndents", header: "Indents", cell: ({ row }) => <span className="font-mono">{row.original.totalIndents}</span> },
    { accessorKey: "totalCrates", header: "Crates", cell: ({ row }) => <span className="font-mono">{row.original.totalCrates}</span> },
    { accessorKey: "totalAmount", header: "Amount", cell: ({ row }) => <span className="font-mono">₹{row.original.totalAmount.toLocaleString()}</span> },
    { accessorKey: "dispatchTime", header: "Timing" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => (
      <span className={`text-xs px-2 py-0.5 rounded ${row.original.status === "Dispatched" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{row.original.status}</span>
    )},
    { id: "action", header: "Action", enableSorting: false, cell: ({ row }) => {
      const d = row.original;
      if (d.status === "Pending" && d.totalIndents > 0) {
        return <Button size="sm" onClick={() => dispatchMut.mutate(d.id)} disabled={dispatchMut.isPending}><Send className="h-3.5 w-3.5 mr-1" /> Dispatch</Button>;
      }
      return d.status === "Dispatched" ? <span className="text-xs text-muted-foreground">Done</span> : <span className="text-xs text-muted-foreground">No indents</span>;
    }},
  ], [routes, dispatchMut]);

  return (
    <div>
      <PageHeader title="Dispatch Sheet" description={`Daily dispatch overview — ${date}`} />
      <Card>
        <CardHeader><CardTitle className="text-base">Today's Dispatches</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={todaysDispatches} showSearch={false} showPagination={false} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DispatchSheetPage;
