import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import ReportViewer from "@/components/ReportViewer";

const GatePassReportPage = () => {
  const [fromDate, setFromDate] = useState("2026-04-01");
  const [toDate, setToDate] = useState("2026-04-08");
  const [showReport, setShowReport] = useState(false);

  const page = (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-sm font-bold uppercase">Haveri Milk Union — Gate Pass Sales Report</h2>
        <p className="text-xs text-muted-foreground">{fromDate} to {toDate}</p>
      </div>
      <table className="w-full text-xs border-collapse">
        <thead><tr className="border">
          <th className="border py-1 px-2 text-left">Date</th>
          <th className="border py-1 px-2 text-left">Agent</th>
          <th className="border py-1 px-2 text-left">Product</th>
          <th className="border py-1 px-2 text-right">Qty</th>
          <th className="border py-1 px-2 text-right">Rate</th>
          <th className="border py-1 px-2 text-right">Amount</th>
        </tr></thead>
        <tbody>
          <tr className="border"><td className="border py-1 px-2">2026-04-08</td><td className="border py-1 px-2">Agent Ravi</td><td className="border py-1 px-2">TM 500</td><td className="border py-1 px-2 text-right">20</td><td className="border py-1 px-2 text-right">₹22.50</td><td className="border py-1 px-2 text-right">₹450.00</td></tr>
          <tr className="border"><td className="border py-1 px-2">2026-04-08</td><td className="border py-1 px-2">Agent Kumar</td><td className="border py-1 px-2">FCM 500</td><td className="border py-1 px-2 text-right">15</td><td className="border py-1 px-2 text-right">₹28.00</td><td className="border py-1 px-2 text-right">₹420.00</td></tr>
          <tr className="border font-semibold"><td className="border py-1 px-2" colSpan={5}>TOTAL</td><td className="border py-1 px-2 text-right">₹870.00</td></tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <PageHeader title="Gate Pass Sales Report" description="View gate pass/adhoc sales" />
      <Card className="mb-6"><CardContent className="pt-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div><Label>From</Label><Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-44" /></div>
          <div><Label>To</Label><Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-44" /></div>
          <Button onClick={() => setShowReport(true)}>Generate</Button>
        </div>
      </CardContent></Card>
      {showReport && <ReportViewer title="Gate Pass Sales Report" pages={[page]} />}
    </div>
  );
};

export default GatePassReportPage;
