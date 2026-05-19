import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { dealerApi } from "@/services/dealerApi";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusColor: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  confirmed: "bg-blue-100 text-blue-800",
  locked: "bg-amber-100 text-amber-800",
  dispatched: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

const OrdersPage: React.FC = () => {
  const { data: orders = [] } = useQuery({ queryKey: ["dealer", "orders"], queryFn: dealerApi.listOrders });

  return (
    <div className="p-3 space-y-2">
      <h2 className="text-sm font-semibold text-muted-foreground px-1">My Orders</h2>
      {orders.length === 0 && <div className="text-center text-xs text-muted-foreground py-8">No orders yet</div>}
      {orders.map((o) => {
        const itemCount = o.standingItems.length + o.adjustmentItems.length;
        return (
          <Link key={o.id} to={`/dealer/orders/${o.id}`}>
            <Card className="p-3 flex items-center justify-between hover:bg-muted/40 transition-colors">
              <div>
                <div className="text-sm font-medium">{format(parseISO(o.deliveryDate), "EEE, d MMM yyyy")}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {itemCount} items · {o.paymentMode === "credit" ? "Credit" : "Paid"}
                </div>
              </div>
              <div className="text-right space-y-1">
                <Badge variant="secondary" className={statusColor[o.status]}>{o.status}</Badge>
                <div className="text-sm font-semibold">₹{o.total.toLocaleString("en-IN")}</div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default OrdersPage;
