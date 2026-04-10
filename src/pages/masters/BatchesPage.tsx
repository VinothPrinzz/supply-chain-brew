import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { batches, routes } from "@/data/mockData";
import { Plus, Edit } from "lucide-react";
import { toast } from "sonner";

const batchTimings: Record<string, string> = {
  Morning: "5:00 AM - 8:00 AM",
  Afternoon: "12:00 PM - 2:00 PM",
  Evening: "4:00 PM - 6:00 PM",
  Night: "8:00 PM - 10:00 PM",
};

interface Props { tab?: "list" | "new"; }

const BatchesPage = ({ tab = "list" }: Props) => {
  const [whichBatch, setWhichBatch] = useState("");
  const [timing, setTiming] = useState("");

  const handleBatchChange = (val: string) => {
    setWhichBatch(val);
    setTiming(batchTimings[val] || "");
  };

  if (tab === "new") {
    return (
      <div>
        <PageHeader title="New Batch" description="Add a new distribution batch" />
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl">
              <div><Label>Batch Code</Label><Input placeholder="e.g. BT04" /></div>
              <div>
                <Label>Which Batch</Label>
                <Select value={whichBatch} onValueChange={handleBatchChange}>
                  <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(batchTimings).map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Timing</Label><Input value={timing} readOnly placeholder="Auto-generated" className="bg-muted/30" /></div>
            </div>
            <div className="mt-6"><Button onClick={() => toast.success("Batch saved (mock)")}><Plus className="h-4 w-4 mr-1" /> Save</Button></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="All Batches" description="Distribution batch timings and assigned routes" />
      {batches.map((b) => {
        const batchRoutes = routes.filter((r) => b.routeIds.includes(r.id));
        return (
          <Card key={b.id} className="mb-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{b.name} <span className="text-xs font-mono text-muted-foreground ml-2">{b.code}</span></CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">{b.whichBatch} — {b.timing}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${b.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{b.status}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-medium text-muted-foreground mb-2">Routes in this batch:</p>
              <table className="w-full text-sm">
                <thead><tr className="border-b">
                  <th className="text-left py-1.5 px-3 font-medium text-muted-foreground">Code</th>
                  <th className="text-left py-1.5 px-3 font-medium text-muted-foreground">Route Name</th>
                  <th className="text-left py-1.5 px-3 font-medium text-muted-foreground">Dispatch Time</th>
                  <th className="text-left py-1.5 px-3 font-medium text-muted-foreground">Status</th>
                </tr></thead>
                <tbody>
                  {batchRoutes.map((r) => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-1.5 px-3 font-mono">{r.code}</td>
                      <td className="py-1.5 px-3">{r.name}</td>
                      <td className="py-1.5 px-3">{r.dispatchTime}</td>
                      <td className="py-1.5 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${r.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                  {batchRoutes.length === 0 && <tr><td colSpan={4} className="py-2 text-center text-muted-foreground text-xs">No routes assigned</td></tr>}
                </tbody>
              </table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BatchesPage;
