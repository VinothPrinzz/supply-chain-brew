import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products, stockEntries, indents, customers } from "@/data/mockData";
import { AlertTriangle, CheckCircle } from "lucide-react";

const DispatchPage = () => {
  // Calculate pending dispatch from pending indents
  const pendingIndents = indents.filter((i) => i.status === "Pending");
  const demandByProduct: Record<string, number> = {};
  pendingIndents.forEach((ind) => {
    ind.items.forEach((it) => {
      demandByProduct[it.productId] = (demandByProduct[it.productId] || 0) + it.quantity;
    });
  });

  const stockByProduct: Record<string, number> = {};
  stockEntries.forEach((s) => {
    stockByProduct[s.productId] = (stockByProduct[s.productId] || 0) + s.quantity;
  });

  return (
    <div>
      <PageHeader title="Dispatch Integration" description="View pending dispatches vs available stock" />

      <Card>
        <CardHeader><CardTitle className="text-base">Pending Dispatch vs Stock</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b">
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Product</th>
              <th className="text-right py-2 px-3 font-medium text-muted-foreground">Pending Demand</th>
              <th className="text-right py-2 px-3 font-medium text-muted-foreground">Available Stock</th>
              <th className="text-right py-2 px-3 font-medium text-muted-foreground">Shortage</th>
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
            </tr></thead>
            <tbody>
              {products.map((p) => {
                const demand = demandByProduct[p.id] || 0;
                const stock = stockByProduct[p.id] || 0;
                const shortage = Math.max(0, demand - stock);
                if (demand === 0 && stock === 0) return null;
                return (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 px-3 font-medium">{p.name}</td>
                    <td className="py-2 px-3 text-right font-mono">{demand}</td>
                    <td className="py-2 px-3 text-right font-mono">{stock}</td>
                    <td className={`py-2 px-3 text-right font-mono ${shortage > 0 ? "text-destructive font-semibold" : ""}`}>{shortage || "-"}</td>
                    <td className="py-2 px-3">
                      {shortage > 0 ? (
                        <span className="flex items-center gap-1 text-xs text-destructive"><AlertTriangle className="h-3 w-3" /> Shortage</span>
                      ) : demand > 0 ? (
                        <span className="flex items-center gap-1 text-xs text-success"><CheckCircle className="h-3 w-3" /> Sufficient</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">No demand</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DispatchPage;
