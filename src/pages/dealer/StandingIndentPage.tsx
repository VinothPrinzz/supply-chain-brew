import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { dealerApi } from "@/services/dealerApi";
import { products } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import QtyStepper from "@/components/dealer/QtyStepper";

const StandingIndentPage: React.FC = () => {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["dealer", "standing"], queryFn: dealerApi.listStandingIndent });
  const setItem = useMutation({
    mutationFn: ({ productId, patch }: { productId: string; patch: any }) =>
      dealerApi.setStandingItem(productId, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dealer", "standing"] }),
  });

  return (
    <div className="p-3 space-y-2">
      <Link to="/dealer/profile" className="text-xs text-muted-foreground inline-flex items-center gap-1">
        <ArrowLeft className="h-3 w-3" /> Back
      </Link>
      <h2 className="text-sm font-semibold">Standing Indent</h2>
      <p className="text-xs text-muted-foreground mb-2">
        Products marked active auto-fill your daily indent.
      </p>
      <Card className="divide-y">
        {items.map((s) => {
          const p = products.find((x) => x.id === s.productId);
          if (!p) return null;
          return (
            <div key={s.productId} className="p-3 flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-sm truncate">{p.name}</div>
                <div className="text-[11px] text-muted-foreground">{p.category}</div>
              </div>
              <QtyStepper
                value={s.defaultQty}
                onChange={(n) => {
                  setItem.mutate({ productId: s.productId, patch: { defaultQty: n, active: n > 0 } });
                }}
                disabled={!s.active}
              />
              <Switch
                checked={s.active}
                onCheckedChange={(v) => {
                  setItem.mutate({ productId: s.productId, patch: { active: v } });
                  toast.success(v ? "Added to standing" : "Removed from standing");
                }}
              />
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default StandingIndentPage;
