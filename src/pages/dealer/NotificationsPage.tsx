import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { dealerApi, type DealerNotificationPref } from "@/services/dealerApi";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const labels: { key: keyof DealerNotificationPref; title: string; desc: string }[] = [
  { key: "credit80", title: "Credit at 80%", desc: "Warn when you've used 80% of your credit limit." },
  { key: "credit100", title: "Credit at 100%", desc: "Block confirmation if order exceeds available credit." },
  { key: "closingReminder", title: "Closing-time reminder", desc: "Nudge 15 min before today's window closes if unsaved." },
  { key: "autoConfirmPreview", title: "Auto-confirm preview", desc: "Night-before summary of tomorrow's indent." },
  { key: "paymentDue", title: "Payment due", desc: "Reminder for credit balances pending past X days." },
  { key: "dispatched", title: "Order dispatched", desc: "Alert when your order leaves the dock." },
];

const NotificationsPage: React.FC = () => {
  const qc = useQueryClient();
  const { data: prefs } = useQuery({ queryKey: ["dealer", "notifs"], queryFn: dealerApi.getNotificationPrefs });
  const setPref = useMutation({
    mutationFn: (patch: Partial<DealerNotificationPref>) => dealerApi.setNotificationPrefs(patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dealer", "notifs"] }),
  });

  return (
    <div className="p-3 space-y-3">
      <Link to="/dealer/profile" className="text-xs text-muted-foreground inline-flex items-center gap-1">
        <ArrowLeft className="h-3 w-3" /> Back
      </Link>
      <h2 className="text-sm font-semibold">Notifications</h2>
      <Card className="divide-y">
        {labels.map((l) => (
          <div key={l.key} className="p-3 flex items-start gap-3">
            <div className="flex-1">
              <div className="text-sm font-medium">{l.title}</div>
              <div className="text-[11px] text-muted-foreground">{l.desc}</div>
            </div>
            <Switch
              checked={!!prefs?.[l.key]}
              onCheckedChange={(v) => setPref.mutate({ [l.key]: v } as Partial<DealerNotificationPref>)}
            />
          </div>
        ))}
      </Card>
    </div>
  );
};

export default NotificationsPage;
