import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProducts, fetchStockEntries } from "@/services/api";
import { Package, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StockRow {
  product: { id: string; name: string; reportAlias: string; category: string };
  received: number;
  dispatched: number;
  wastage: number;
  current: number;
}

const StockDashboard = () => {
  const { data: products = [], isLoading: lp } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { data: stockEntries = [], isLoading: ls } = useQuery({ queryKey: ["stockEntries"], queryFn: fetchStockEntries });
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [...new Set(products.map(p => p.category))];

  const stockByProduct: StockRow[] = useMemo(() => products.map(p => {
    const entries = stockEntries.filter(s => s.productId === p.id);
    const received = entries.filter(s => s.quantity > 0).reduce((sum, s) => sum + s.quantity, 0);
    const dispatched = Math.abs(entries.filter(s => s.type === "Dispatch").reduce((sum, s) => sum + s.quantity, 0));
    const wastage = Math.abs(entries.filter(s => s.type === "Wastage").reduce((sum, s) => sum + s.quantity, 0));
    const current = entries.reduce((sum, s) => sum + s.quantity, 0);
    return { product: p, received, dispatched, wastage, current };
  }).filter(s => categoryFilter === "all" || s.product.category === categoryFilter), [products, stockEntries, categoryFilter]);

  const totalStock = stockByProduct.reduce((s, i) => s + Math.max(0, i.current), 0);
  const lowItems = stockByProduct.filter(s => s.current > 0 && s.current < 50);
  const outOfStock = stockByProduct.filter(s => s.current <= 0);

  const columns = useMemo<ColumnDef<StockRow>[]>(() => [
    { accessorFn: r => r.product.name, id: "name", header: "Product", cell: ({ row }) => <span className="font-medium">{row.original.product.name}</span> },
    { accessorFn: r => r.product.category, id: "category", header: "Category", cell: ({ row }) => <span className="text-xs px-1.5 py-0.5 rounded bg-secondary">{row.original.product.category}</span> },
    { accessorKey: "received", header: "Received", cell: ({ row }) => <span className="font-mono text-success">{row.original.received}</span> },
    { accessorKey: "dispatched", header: "Dispatched", cell: ({ row }) => <span className="font-mono text-destructive">{row.original.dispatched}</span> },
    { accessorKey: "wastage", header: "Wastage", cell: ({ row }) => <span className="font-mono text-warning">{row.original.wastage}</span> },
    { accessorKey: "current", header: "Current Stock", cell: ({ row }) => <span className="font-mono font-semibold">{row.original.current}</span> },
    { id: "status", header: "Status", cell: ({ row }) => {
      const c = row.original.current;
      return c <= 0 ? <span className="text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive">Out</span>
        : c < 50 ? <span className="text-xs px-2 py-0.5 rounded bg-warning/10 text-warning">Low</span>
        : <span className="text-xs px-2 py-0.5 rounded bg-success/10 text-success">OK</span>;
    }},
  ], []);

  if (lp || ls) return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;

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
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Stock Position</CardTitle>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={stockByProduct} searchPlaceholder="Search products..." />
        </CardContent>
      </Card>
    </div>
  );
};

export default StockDashboard;
