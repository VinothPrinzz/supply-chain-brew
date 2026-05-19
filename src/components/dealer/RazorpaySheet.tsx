import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  amount: number;
  title?: string;
  onClose: () => void;
  onPaid: (paymentId: string) => void;
  onPay: () => Promise<{ id: string }>;
}

const RazorpaySheet: React.FC<Props> = ({ open, amount, title = "Razorpay", onClose, onPaid, onPay }) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await onPay();
      onPaid(res.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-md p-4 text-center">
            <div className="text-xs text-muted-foreground">Amount</div>
            <div className="text-2xl font-bold">₹{amount.toLocaleString("en-IN")}</div>
          </div>
          <div className="flex gap-2 text-xs">
            <div className="flex-1 border rounded p-2 text-center bg-muted/30">UPI</div>
            <div className="flex-1 border rounded p-2 text-center">Card</div>
            <div className="flex-1 border rounded p-2 text-center">Netbanking</div>
          </div>
          <Button className="w-full" onClick={handlePay} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Pay ₹{amount.toLocaleString("en-IN")}
          </Button>
          <p className="text-[10px] text-center text-muted-foreground">Simulated Razorpay sandbox</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RazorpaySheet;
