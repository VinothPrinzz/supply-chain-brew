import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { batches, agents, products, customers, indents } from "@/data/mockData";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const RecordIndentsPage = () => {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [indentDate, setIndentDate] = useState("2026-04-08");
  const [agentCode, setAgentCode] = useState("");
  const [showIndent, setShowIndent] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const handleGo = () => {
    if (!selectedBatch || !agentCode) {
      toast.error("Select batch and agent code");
      return;
    }
    setShowIndent(true);
  };

  // Mock indent data for display
  const mockIndentProducts = products.filter((p) => !p.terminated).slice(0, 6);

  return (
    <div>
      <PageHeader
        title="Record Indents"
        description="Record daily indents from agents"
        actions={<Button variant="destructive" size="sm" onClick={() => setShowReset(true)}>Reset Indents</Button>}
      />

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Select Batch & Agent</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <Label>Batch</Label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-52"><SelectValue placeholder="Select batch" /></SelectTrigger>
                <SelectContent>
                  {batches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name} ({b.timing})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Indent Date</Label>
              <Input type="date" value={indentDate} onChange={(e) => setIndentDate(e.target.value)} className="w-44" />
            </div>
            <div>
              <Label>Agent Code</Label>
              <Select value={agentCode} onValueChange={setAgentCode}>
                <SelectTrigger className="w-52"><SelectValue placeholder="Select agent" /></SelectTrigger>
                <SelectContent>
                  {agents.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} — {a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGo}>GO</Button>
          </div>
        </CardContent>
      </Card>

      {showIndent && (
        <Card>
          <CardHeader><CardTitle className="text-base">Indent Entry — {agents.find((a) => a.code === agentCode)?.name}</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Product</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">MRP</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground">Qty (Packets)</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground">Crates</th>
                </tr></thead>
                <tbody>
                  {mockIndentProducts.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2 px-3">{p.name}</td>
                      <td className="py-2 px-3 text-right">₹{p.mrp}</td>
                      <td className="py-2 px-3 text-center"><Input type="number" className="w-20 mx-auto text-center" defaultValue="0" /></td>
                      <td className="py-2 px-3 text-center text-muted-foreground">0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => toast.success("Indent saved (mock)")}>Save Indent</Button>
              <Button variant="outline" onClick={() => setShowIndent(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reset Dialog */}
      <Dialog open={showReset} onOpenChange={setShowReset}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reset Indents</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">Enter your credentials to reset all indents for today.</p>
          <div className="space-y-3">
            <div><Label>Username</Label><Input placeholder="Username" /></div>
            <div><Label>Password</Label><Input type="password" placeholder="Password" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReset(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { toast.success("Indents reset (mock)"); setShowReset(false); }}>Confirm Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecordIndentsPage;
