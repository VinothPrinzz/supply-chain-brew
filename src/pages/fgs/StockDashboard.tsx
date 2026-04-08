import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products, stockEntries } from "@/data/mockData";
import { Package, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

const StockDashboard = () => {
  const stockByProduct = products.map((p) => {
    const entries = stockEntries.filter((s) => s.productId === p.id);
    const received = entries.filter((s) => s.quantity > 0).reduce((sum, s) => sum + s.quantity, 0);
    const dispatched = Math.abs(entries.filter((s) => s.type === "Dispatch").reduce((sum, s) => sum + s.quantity, 0));
    const wastage = Math.abs(entries.filter((s) => s.type === "Wastage").reduce((sum, s) => sum + s.quantity, 0));
    const current = entries.reduce((sum, s) => sum + s.quantity, 0);
    return { product: p, received, dispatched, wastage, current };
  });

  const totalStock = stockByProduct.reduce((s, i) => s + Math.max(0, i.current), 0);
  const lowItems = stockByProduct.filter((s) => s.current > 0 && s.current < 50);
  const outOfStock = stockByProduct.filter((s) => s.current <= 0);

  return (
    <div>
      <PageHeader title="FGS — Stock Dashboard" description="Current stock levels and alerts" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><div className="flex justify-between items-center"><div><p className="text-xs text-muted-foreground">Total Stock</p><p className="text-2xl font-bold">{totalStock}</p></div><Package className="h-8 w-8 text-primary opacity-60" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between items-center"><div><p className="text-xs text-muted-foreground">Products Tracked</p><p className="text-2xl font-bold">{products.length}</p></div><TrendingUp className="h-8 w-8 text-primary opacity-60" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between items-center"><div><p className="text-xs text-muted-foreground">Low Stock</p><p className="text-2xl font-bold">{lowItems.length}</p></div><TrendingDown className="h-8 w-8 text-warning opacity-60" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between items-center"><div><p className="text-xs text-muted-foreground">Out of Stock</p><p className="text-2xl font-bold">{outOfStock.length}</p></div><AlertTriangle className="h-8 w-8 text-destructive opacity-60" /></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Stock Position</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Product</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Received</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Dispatched</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Wastage</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Current Stock</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {stockByProduct.map((s) => (
                  <tr key={s.product.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 px-3 font-medium">{s.product.name}</td>
                    <td className="py-2 px-3 text-right font-mono text-success">{s.received}</td>
                    <td className="py-2 px-3 text-right font-mono text-destructive">{s.dispatched}</td>
                    <td className="py-2 px-3 text-right font-mono text-warning">{s.wastage}</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">{s.current}</td>
                    <td className="py-2 px-3">
                      {s.current <= 0 ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive">Out</span>
                      ) : s.current < 50 ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-warning/10 text-warning">Low</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded bg-success/10 text-success">OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockDashboard;
