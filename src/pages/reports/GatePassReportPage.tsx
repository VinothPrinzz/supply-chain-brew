import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import ReportViewer from "@/components/ReportViewer";
import { fetchProducts } from "@/services/api";

const GatePassReportPage = () => {
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const [fromDate, setFromDate] = useState("2026-04-01");
  const [toDate, setToDate] = useState("2026-04-08");
  const [showReport, setShowReport] = useState(false);

  const mockGatePassData = [
    { gpNo: "GP-001", date: "2026-04-08", agent: "Agent Ravi", items: [{ name: "TM 500", qty: 20 }, { name: "FCM 500", qty: 15 }], amount: 1295 },
    { gpNo: "GP-002", date: "2026-04-08", agent: "Agent Kumar", items: [{ name: "Curd 500", qty: 10 }, { name: "Ghee 500", qty: 5 }], amount: 1580 },
    { gpNo: "GP-003", date: "2026-04-07", agent: "Agent Ravi", items: [{ name: "TM 500", qty: 30 }], amount: 675 },
    { gpNo: "GP-004", date: "2026-04-07", agent: "Agent Prakash", items: [{ name: "BM 200", qty: 60 }, { name: "Lassi 200", qty: 24 }], amount: 864 },
  ];

  const totalAmount = mockGatePassData.reduce((s, gp) => s + gp.amount, 0);

  const page = (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-sm font-bold uppercase">Haveri Milk Union — Gate Pass Sales Report</h2>
        <p className="text-xs text-muted-foreground">{fromDate} to {toDate}</p>
      </div>
      <table className="w-full text-xs border-collapse">
        <thead><tr className="border">
          <th className="border py-1 px-2 text-left">GP No.</th>
          <th className="border py-1 px-2 text-left">Date</th>
          <th className="border py-1 px-2 text-left">Agent</th>
          <th className="border py-1 px-2 text-left">Items</th>
          <th className="border py-1 px-2 text-right">Amount</th>
        </tr></thead>
        <tbody>
          {mockGatePassData.map(gp => (
            <tr key={gp.gpNo} className="border">
              <td className="border py-1 px-2 font-mono">{gp.gpNo}</td>
              <td className="border py-1 px-2">{gp.date}</td>
              <td className="border py-1 px-2">{gp.agent}</td>
              <td className="border py-1 px-2">{gp.items.map((item, i) => <div key={i}>{item.name} × {item.qty}</div>)}</td>
              <td className="border py-1 px-2 text-right">₹{gp.amount.toLocaleString()}</td>
            </tr>
          ))}
          <tr className="border font-semibold">
            <td className="border py-1 px-2" colSpan={4}>TOTAL</td>
            <td className="border py-1 px-2 text-right">₹{totalAmount.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <PageHeader title="Gate Pass Sales Report" description="View gate pass/adhoc sales" />
      <Card className="mb-6"><CardContent className="pt-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div><Label>From</Label><Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-44" /></div>
          <div><Label>To</Label><Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-44" /></div>
          <Button onClick={() => setShowReport(true)}>Generate</Button>
        </div>
      </CardContent></Card>
      {showReport && <ReportViewer title="Gate Pass Sales Report" pages={[page]} />}
    </div>
  );
};

export default GatePassReportPage;
