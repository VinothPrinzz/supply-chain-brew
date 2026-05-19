import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, CreditCard, Star, Bell, LogOut } from "lucide-react";
import { dealerApi } from "@/services/dealerApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ProfilePage: React.FC = () => {
  const { data: dealer } = useQuery({ queryKey: ["dealer", "me"], queryFn: dealerApi.getCurrentDealer });
  const { data: credit } = useQuery({ queryKey: ["dealer", "credit"], queryFn: dealerApi.getCredit });
  const pct = credit ? (credit.used / credit.limit) * 100 : 0;

  return (
    <div className="p-3 space-y-3">
      <Card className="p-4">
        <div className="font-semibold">{dealer?.name}</div>
        <div className="text-xs text-muted-foreground mt-1">
          Code: {dealer?.code} · {dealer?.phone}
        </div>
        <div className="text-xs text-muted-foreground">{dealer?.address}, {dealer?.city}</div>
      </Card>

      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Credit Limit</span>
          </div>
          <Link to="/dealer/profile/credit" className="text-xs text-primary">Top Up</Link>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>₹{credit?.used.toLocaleString("en-IN")} used</span>
            <span className="text-muted-foreground">of ₹{credit?.limit.toLocaleString("en-IN")}</span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>
      </Card>

      <ProfileLink to="/dealer/profile/standing-indent" icon={Star} label="Standing Indent" subtitle="Edit your daily defaults" />
      <ProfileLink to="/dealer/profile/notifications" icon={Bell} label="Notifications" subtitle="Manage alert preferences" />

      <Button variant="outline" className="w-full" asChild>
        <a href="/"><LogOut className="h-4 w-4 mr-2" />Switch to Admin App</a>
      </Button>
      <div className="text-center text-[10px] text-muted-foreground pt-2">Dealer App v0.1</div>
    </div>
  );
};

const ProfileLink: React.FC<{ to: string; icon: any; label: string; subtitle: string }> = ({ to, icon: Icon, label, subtitle }) => (
  <Link to={to}>
    <Card className="p-3 flex items-center gap-3 hover:bg-muted/40">
      <Icon className="h-4 w-4 text-primary" />
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-[11px] text-muted-foreground">{subtitle}</div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Card>
  </Link>
);

export default ProfilePage;
