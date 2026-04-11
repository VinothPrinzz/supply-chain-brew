import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { fetchRoutes, fetchBatches, fetchIndents, fetchCustomers, fetchProducts, postIndents } from "@/services/api";
import { toast } from "sonner";
import { Send } from "lucide-react";

const PostIndentPage = () => {
  const qc = useQueryClient();
  const { data: routes = [] } = useQuery({ queryKey: ["routes"], queryFn: fetchRoutes });
  const { data: batches = [] } = useQuery({ queryKey: ["batches"], queryFn: fetchBatches });
  const { data: indents = [] } = useQuery({ queryKey: ["indents"], queryFn: fetchIndents });
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const pendingForRoute = indents.filter(i => i.routeId === selectedRoute && i.batchId === selectedBatch && i.status === "Pending");

  const postMut = useMutation({
    mutationFn: () => postIndents(selectedRoute, selectedBatch),
    onSuccess: (count) => {
      toast.success(`${count} indent(s) posted & route sheet generated`);
      setShowConfirm(false);
      qc.invalidateQueries({ queryKey: ["indents"] });
    },
  });

  return (
    <div>
      <PageHeader title="Post Indent" description="Club and post indents for a route to generate route sheets" />
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Select Route & Batch</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div><Label>Route</Label>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger className="w-52"><SelectValue placeholder="Select route" /></SelectTrigger>
                <SelectContent>{routes.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Batch</Label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-52"><SelectValue placeholder="Select batch" /></SelectTrigger>
                <SelectContent>{batches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedRoute && selectedBatch && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pending Indents ({pendingForRoute.length})</CardTitle>
              <Button onClick={() => setShowConfirm(true)} disabled={pendingForRoute.length === 0}>
                <Send className="h-4 w-4 mr-1" /> Post Indents
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {pendingForRoute.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending indents for this route and batch.</p>
            ) : (
              <div className="overflow-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted/30">
                    <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Products</th>
                    <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Total Qty</th>
                  </tr></thead>
                  <tbody>
                    {pendingForRoute.map(ind => {
                      const cust = customers.find(c => c.id === ind.customerId);
                      const totalQty = ind.items.reduce((s, i) => s + i.quantity, 0);
                      return (
                        <tr key={ind.id} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="py-2 px-3 font-medium">{cust?.name || ind.customerId}</td>
                          <td className="py-2 px-3 text-muted-foreground">
                            {ind.items.map(it => {
                              const prod = products.find(p => p.id === it.productId);
                              return `${prod?.reportAlias || it.productId}: ${it.quantity}`;
                            }).join(", ")}
                          </td>
                          <td className="py-2 px-3 text-right font-mono">{totalQty}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Post</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will club {pendingForRoute.length} indent(s) and generate route sheets. Stock will be auto-deducted from FGS.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button onClick={() => postMut.mutate()} disabled={postMut.isPending}>{postMut.isPending ? "Posting..." : "Confirm Post"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostIndentPage;
