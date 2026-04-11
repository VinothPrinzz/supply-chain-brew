import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProducts, fetchStockEntries, fetchIndents } from "@/services/api";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface DispatchRow {
  product: { id: string; name: string };
  demand: number;
  stock: number;
  shortage: number;
}

const DispatchPage = () => {
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { data: stockEntries = [] } = useQuery({ queryKey: ["stockEntries"], queryFn: fetchStockEntries });
  const { data: indents = [] } = useQuery({ queryKey: ["indents"], queryFn: fetchIndents });

  const dispatchData = useMemo<DispatchRow[]>(() => {
    const pendingIndents = indents.filter(i => i.status === "Pending");
    const demandByProduct: Record<string, number> = {};
    pendingIndents.forEach(ind => ind.items.forEach(it => {
      demandByProduct[it.productId] = (demandByProduct[it.productId] || 0) + it.quantity;
    }));

    const stockByProduct: Record<string, number> = {};
    stockEntries.forEach(s => { stockByProduct[s.productId] = (stockByProduct[s.productId] || 0) + s.quantity; });

    return products
      .map(p => {
        const demand = demandByProduct[p.id] || 0;
        const stock = stockByProduct[p.id] || 0;
        return { product: p, demand, stock, shortage: Math.max(0, demand - stock) };
      })
      .filter(r => r.demand > 0 || r.stock > 0);
  }, [products, stockEntries, indents]);

  const columns = useMemo<ColumnDef<DispatchRow>[]>(() => [
    { accessorFn: r => r.product.name, id: "product", header: "Product", cell: ({ row }) => <span className="font-medium">{row.original.product.name}</span> },
    { accessorKey: "demand", header: "Pending Demand", cell: ({ row }) => <span className="font-mono">{row.original.demand}</span> },
    { accessorKey: "stock", header: "Available Stock", cell: ({ row }) => <span className="font-mono">{row.original.stock}</span> },
    { accessorKey: "shortage", header: "Shortage", cell: ({ row }) => (
      <span className={`font-mono ${row.original.shortage > 0 ? "text-destructive font-semibold" : ""}`}>{row.original.shortage || "-"}</span>
    )},
    { id: "status", header: "Status", cell: ({ row }) => {
      if (row.original.shortage > 0) return <span className="flex items-center gap-1 text-xs text-destructive"><AlertTriangle className="h-3 w-3" /> Shortage</span>;
      if (row.original.demand > 0) return <span className="flex items-center gap-1 text-xs text-success"><CheckCircle className="h-3 w-3" /> Sufficient</span>;
      return <span className="text-xs text-muted-foreground">No demand</span>;
    }},
  ], []);

  return (
    <div>
      <PageHeader title="Dispatch Integration" description="View pending dispatches vs available stock" />
      <Card>
        <CardHeader><CardTitle className="text-base">Pending Dispatch vs Stock</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={dispatchData} showSearch={false} showPagination={false} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DispatchPage;
