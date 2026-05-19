import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { dealerApi } from "@/services/dealerApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import RazorpaySheet from "@/components/dealer/RazorpaySheet";

const CreditPage: React.FC = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: credit } = useQuery({ queryKey: ["dealer", "credit"], queryFn: dealerApi.getCredit });
  const [amount, setAmount] = useState(5000);
  const [showRzp, setShowRzp] = useState(false);

  const pct = credit ? (credit.used / credit.limit) * 100 : 0;

  return (
    <div className="p-3 space-y-3">
      <Link to="/dealer/profile" className="text-xs text-muted-foreground inline-flex items-center gap-1">
        <ArrowLeft className="h-3 w-3" /> Back
      </Link>
      <h2 className="text-sm font-semibold">Credit Limit Top Up</h2>

      <Card className="p-4 space-y-2">
        <div className="text-xs text-muted-foreground">Currently used</div>
        <div className="text-2xl font-bold">₹{credit?.used.toLocaleString("en-IN")}</div>
        <div className="text-xs text-muted-foreground">of ₹{credit?.limit.toLocaleString("en-IN")} limit</div>
        <Progress value={pct} className="h-2" />
      </Card>

      <Card className="p-4 space-y-3">
        <div className="text-sm font-medium">Top up amount</div>
        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <div className="flex gap-2">
          {[1000, 5000, 10000, 25000].map((v) => (
            <Button key={v} size="sm" variant="outline" onClick={() => setAmount(v)}>
              ₹{v.toLocaleString("en-IN")}
            </Button>
          ))}
        </div>
        <Button className="w-full" disabled={amount <= 0} onClick={() => setShowRzp(true)}>
          Pay ₹{amount.toLocaleString("en-IN")} via Razorpay
        </Button>
      </Card>

      <RazorpaySheet
        open={showRzp}
        amount={amount}
        title="Credit top-up"
        onClose={() => setShowRzp(false)}
        onPay={() => dealerApi.simulateRazorpayPayment(amount, "topup")}
        onPaid={() => {
          setShowRzp(false);
          qc.invalidateQueries({ queryKey: ["dealer", "credit"] });
          toast.success(`₹${amount.toLocaleString("en-IN")} added to credit`);
          navigate("/dealer/profile");
        }}
      />
    </div>
  );
};

export default CreditPage;
