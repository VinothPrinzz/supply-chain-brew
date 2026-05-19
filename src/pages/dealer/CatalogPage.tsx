import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { dealerApi, type OrderItem } from "@/services/dealerApi";
import { products } from "@/data/mockData";
import QtyStepper from "@/components/dealer/QtyStepper";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [sp] = useSearchParams();
  const date = sp.get("date") || format(new Date(), "yyyy-MM-dd");

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), []);
  const [activeCat, setActiveCat] = useState(categories[0]);
  const [search, setSearch] = useState("");

  const { data: order } = useQuery({
    queryKey: ["dealer", "order", date],
    queryFn: () => dealerApi.getOrderForDate(date),
  });

  const update = useMutation({
    mutationFn: (items: OrderItem[]) => dealerApi.upsertDraft(date, { adjustmentItems: items }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dealer", "order", date] }),
  });

  const visible = useMemo(() => {
    let list = products.filter((p) => !p.terminated);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    } else {
      list = list.filter((p) => p.category === activeCat);
    }
    return list;
  }, [search, activeCat]);

  const qtyFor = (productId: string) => {
    if (!order) return 0;
    const std = order.standingItems.find((i) => i.productId === productId);
    const adj = order.adjustmentItems.find((i) => i.productId === productId);
    return (std?.qty || 0) + (adj?.qty || 0);
  };

  const adjustOnly = (productId: string, newQty: number) => {
    if (!order) return;
    const std = order.standingItems.find((i) => i.productId === productId);
    const stdQty = std?.qty || 0;
    const adjQty = Math.max(0, newQty - stdQty);
    const existing = order.adjustmentItems.filter((i) => i.productId !== productId);
    const items = adjQty > 0 ? [...existing, { productId, qty: adjQty }] : existing;
    update.mutate(items);
  };

  const total = order?.total ?? 0;

  return (
    <div className="flex flex-col h-[calc(100vh-64px-56px)]">
      <div className="p-2 border-b bg-background sticky top-[60px] z-10">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products"
            className="pl-8 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Category rail */}
        <div className="w-[90px] border-r overflow-y-auto bg-muted/30 shrink-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setActiveCat(c);
                setSearch("");
              }}
              className={cn(
                "w-full text-[11px] py-3 px-1 text-center border-l-2 transition-colors",
                !search && c === activeCat
                  ? "bg-background border-primary font-semibold text-primary"
                  : "border-transparent text-muted-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {visible.map((p) => {
            const qty = qtyFor(p.id);
            const rate = dealerApi.getProductPrice(p);
            return (
              <Card key={p.id} className="p-3 flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground">₹{rate} · {p.packSize}{p.unit} · {p.category}</div>
                </div>
                <QtyStepper value={qty} onChange={(n) => adjustOnly(p.id, n)} />
              </Card>
            );
          })}
          {visible.length === 0 && (
            <div className="text-center text-xs text-muted-foreground py-8">No products</div>
          )}
        </div>
      </div>

      {total > 0 && (
        <div className="sticky bottom-16 left-0 right-0 p-2">
          <Button className="w-full h-11" onClick={() => navigate(`/dealer/indent?date=${date}`)}>
            View Indent · ₹{total.toLocaleString("en-IN")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
