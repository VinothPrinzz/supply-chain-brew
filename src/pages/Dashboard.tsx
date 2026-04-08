import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { products, customers, routes, indents, stockEntries } from "@/data/mockData";
import { Package, Users, MapPin, AlertTriangle, TrendingUp, Warehouse } from "lucide-react";

const Dashboard = () => {
  const activeCustomers = customers.filter((c) => c.status === "Active").length;
  const pendingIndents = indents.filter((i) => i.status === "Pending").length;
  const totalProducts = products.filter((p) => !p.terminated).length;

  // Calculate current stock
  const stockByProduct = products.map((p) => {
    const qty = stockEntries
      .filter((s) => s.productId === p.id)
      .reduce((sum, s) => sum + s.quantity, 0);
    return { product: p, stock: qty };
  });
  const lowStockCount = stockByProduct.filter((s) => s.stock < 50 && s.stock >= 0).length;

  const stats = [
    { label: "Active Products", value: totalProducts, icon: Package, color: "text-primary" },
    { label: "Active Customers", value: activeCustomers, icon: Users, color: "text-primary" },
    { label: "Routes", value: routes.length, icon: MapPin, color: "text-primary" },
    { label: "Pending Indents", value: pendingIndents, icon: TrendingUp, color: "text-warning" },
    { label: "Low Stock Items", value: lowStockCount, icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of marketing operations" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
                <s.icon className={`h-8 w-8 ${s.color} opacity-70`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stock Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Warehouse className="h-4 w-4" /> Current Stock Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Product</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Current Stock</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {stockByProduct.map((s) => (
                  <tr key={s.product.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 px-3">{s.product.name}</td>
                    <td className="py-2 px-3 text-right font-mono">{s.stock}</td>
                    <td className="py-2 px-3">
                      {s.stock <= 0 ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive">Out of Stock</span>
                      ) : s.stock < 50 ? (
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

export default Dashboard;
