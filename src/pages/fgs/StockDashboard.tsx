import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { products, stockEntries } from "@/data/mockData";
import { Package, AlertTriangle, TrendingDown, TrendingUp, Search } from "lucide-react";

const StockDashboard = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [...new Set(products.map((p) => p.category))];

  const stockByProduct = products.map((p) => {
    const entries = stockEntries.filter((s) => s.productId === p.id);
    const received = entries.filter((s) => s.quantity > 0).reduce((sum, s) => sum + s.quantity, 0);
    const dispatched = Math.abs(entries.filter((s) => s.type === "Dispatch").reduce((sum, s) => sum + s.quantity, 0));
    const wastage = Math.abs(entries.filter((s) => s.type === "Wastage").reduce((sum, s) => sum + s.quantity, 0));
    const current = entries.reduce((sum, s) => sum + s.quantity, 0);
    return { product: p, received, dispatched, wastage, current };
  }).filter((s) => {
    const matchSearch = s.product.name.toLowerCase().includes(search.toLowerCase()) || s.product.reportAlias.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || s.product.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalStock = stockByProduct.reduce((s, i) => s + Math.max(0, i.current), 0);
  const lowItems = stockByProduct.filter((s) => s.current > 0 && s.current < 50);
  const outOfStock = stockByProduct.filter((s) => s.current <= 0);

  return (
    <div>
      <PageHeader title="FGS — Stock Overview" description="Current stock levels and alerts" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><div className="flex justify-between items-center"><div><p className="text-xs text-muted-foreground">Total Stock</p><p className="text-2xl font-bold">{totalStock}</p></div><Package className="h-8 w-8 text-primary opacity-60" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between items-center"><div><p className="text-xs text-muted-foreground">Products Tracked</p><p className="text-2xl font-bold">{products.length}</p></div><TrendingUp className="h-8 w-8 text-primary opacity-60" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between items-center"><div><p className="text-xs text-muted-foreground">Low Stock</p><p className="text-2xl font-bold">{lowItems.length}</p></div><TrendingDown className="h-8 w-8 text-warning opacity-60" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between items-center"><div><p className="text-xs text-muted-foreground">Out of Stock</p><p className="text-2xl font-bold">{outOfStock.length}</p></div><AlertTriangle className="h-8 w-8 text-destructive opacity-60" /></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <CardTitle className="text-base">Stock Position</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-44" />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Product</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Category</th>
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
                    <td className="py-2 px-3"><span className="text-xs px-1.5 py-0.5 rounded bg-secondary">{s.product.category}</span></td>
                    <td className="py-2 px-3 text-right font-mono text-success">{s.received}</td>
                    <td className="py-2 px-3 text-right font-mono text-destructive">{s.dispatched}</td>
                    <td className="py-2 px-3 text-right font-mono text-warning">{s.wastage}</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">{s.current}</td>
                    <td className="py-2 px-3">
                      {s.current <= 0 ? <span className="text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive">Out</span>
                        : s.current < 50 ? <span className="text-xs px-2 py-0.5 rounded bg-warning/10 text-warning">Low</span>
                        : <span className="text-xs px-2 py-0.5 rounded bg-success/10 text-success">OK</span>}
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
