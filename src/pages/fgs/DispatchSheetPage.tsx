import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dispatchEntries, routes, contractors } from "@/data/mockData";
import { Send } from "lucide-react";
import { toast } from "sonner";

const DispatchSheetPage = () => {
  const [date] = useState("2026-04-08");

  return (
    <div>
      <PageHeader title="Dispatch Sheet" description={`Daily dispatch overview — ${date}`} />
      <Card>
        <CardHeader><CardTitle className="text-base">Today's Dispatches</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Route Name</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Indents</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Crates</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Timing</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Action</th>
              </tr></thead>
              <tbody>
                {dispatchEntries.filter((d) => d.date === date).map((d) => {
                  const route = routes.find((r) => r.id === d.routeId);
                  return (
                    <tr key={d.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2 px-3 font-medium">{route?.name || d.routeId}</td>
                      <td className="py-2 px-3 text-right font-mono">{d.totalIndents}</td>
                      <td className="py-2 px-3 text-right font-mono">{d.totalCrates}</td>
                      <td className="py-2 px-3 text-right font-mono">₹{d.totalAmount.toLocaleString()}</td>
                      <td className="py-2 px-3">{d.dispatchTime}</td>
                      <td className="py-2 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${d.status === "Dispatched" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{d.status}</span>
                      </td>
                      <td className="py-2 px-3">
                        {d.status === "Pending" && d.totalIndents > 0 ? (
                          <Button size="sm" onClick={() => toast.success(`Route ${route?.name} dispatched (mock)`)}>
                            <Send className="h-3.5 w-3.5 mr-1" /> Dispatch
                          </Button>
                        ) : d.status === "Dispatched" ? (
                          <span className="text-xs text-muted-foreground">Done</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">No indents</span>
                        )}
                      </td>
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

export default DispatchSheetPage;
