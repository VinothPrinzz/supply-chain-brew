import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { fetchCancellationRequests, fetchCustomers, fetchRoutes, fetchProducts, approveCancellation, rejectCancellation, getAgents } from "@/services/api";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { CancellationRequest } from "@/data/mockData";

const CancellationRequestsPage = () => {
  const qc = useQueryClient();
  const { data: requests = [] } = useQuery({ queryKey: ["cancellations"], queryFn: fetchCancellationRequests });
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: routes = [] } = useQuery({ queryKey: ["routes"], queryFn: fetchRoutes });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const agents = getAgents();

  const [filter, setFilter] = useState<"all" | "Pending" | "Approved" | "Rejected">("all");
  const [rejectDialog, setRejectDialog] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = requests.filter(r => filter === "all" || r.status === filter);

  const approveMut = useMutation({
    mutationFn: (id: string) => approveCancellation(id),
    onSuccess: () => { toast.success("Request approved"); qc.invalidateQueries({ queryKey: ["cancellations"] }); },
  });

  const rejectMut = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectCancellation(id, reason),
    onSuccess: () => { toast.success("Request rejected"); qc.invalidateQueries({ queryKey: ["cancellations"] }); setRejectDialog(null); },
  });

  return (
    <div>
      <PageHeader title="Cancellation Requests" description="Review dealer cancellation and modification requests" />
      <div className="flex gap-2 mb-4">
        {(["all", "Pending", "Approved", "Rejected"] as const).map(f => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f} {f !== "all" && `(${requests.filter(r => r.status === f).length})`}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(req => {
          const cust = customers.find(c => c.id === req.customerId);
          const agent = agents.find(a => a.code === req.agentCode);
          const route = routes.find(r => r.id === req.routeId);

          return (
            <Card key={req.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-semibold">{req.indentId}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${req.type === "Cancel" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>{req.type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${req.status === "Pending" ? "bg-warning/10 text-warning" : req.status === "Approved" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{req.status}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                      <div><span className="text-muted-foreground">Agent:</span> {agent?.name}</div>
                      <div><span className="text-muted-foreground">Customer:</span> {cust?.name}</div>
                      <div><span className="text-muted-foreground">Route:</span> {route?.name}</div>
                      <div><span className="text-muted-foreground">Time:</span> {req.requestTime}</div>
                    </div>
                    <div className="text-sm mb-2">
                      <span className="text-muted-foreground">Items: </span>
                      {req.items.map(item => {
                        const p = products.find(pr => pr.id === item.productId);
                        return `${p?.reportAlias || item.productId} × ${item.quantity}`;
                      }).join(", ")}
                    </div>
                    <div className="text-sm"><span className="text-muted-foreground">Total: </span><span className="font-mono font-semibold">₹{req.totalAmount.toLocaleString()}</span></div>
                    <div className="text-sm mt-1"><span className="text-muted-foreground">Reason: </span>{req.reason}</div>
                    {req.status === "Rejected" && req.rejectionReason && (
                      <div className="text-sm mt-1 text-destructive"><span className="text-muted-foreground">Rejection: </span>{req.rejectionReason}</div>
                    )}
                  </div>
                  {req.status === "Pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => approveMut.mutate(req.id)} disabled={approveMut.isPending}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => { setRejectDialog(req.id); setRejectReason(""); }}>
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No requests found</p>}
      </div>

      <Dialog open={!!rejectDialog} onOpenChange={() => setRejectDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Request</DialogTitle></DialogHeader>
          <div><Label>Reason for Rejection</Label><Input value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Enter reason" /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => rejectDialog && rejectMut.mutate({ id: rejectDialog, reason: rejectReason })} disabled={!rejectReason || rejectMut.isPending}>
              {rejectMut.isPending ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CancellationRequestsPage;
