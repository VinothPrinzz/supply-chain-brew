import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import ReportViewer from "@/components/ReportViewer";
import { fetchProducts, fetchStockEntries } from "@/services/api";

const StockReportsPage = () => {
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { data: stockEntries = [] } = useQuery({ queryKey: ["stockEntries"], queryFn: fetchStockEntries });
  const [fromDate, setFromDate] = useState("2026-04-07");
  const [toDate, setToDate] = useState("2026-04-08");
  const [showReport, setShowReport] = useState(false);

  const reportPage = (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold">HAVERI MILK UNION — STOCK POSITION REPORT</h2>
        <p className="text-sm text-muted-foreground">{fromDate} to {toDate}</p>
      </div>
      <table className="w-full text-xs border-collapse">
        <thead><tr className="border">
          <th className="border py-1 px-2 text-left">Product</th>
          <th className="border py-1 px-2 text-right">Opening</th>
          <th className="border py-1 px-2 text-right">Received</th>
          <th className="border py-1 px-2 text-right">Dispatched</th>
          <th className="border py-1 px-2 text-right">Wastage</th>
          <th className="border py-1 px-2 text-right">Closing</th>
        </tr></thead>
        <tbody>
          {products.map(p => {
            const entries = stockEntries.filter(s => s.productId === p.id);
            const received = entries.filter(s => s.quantity > 0).reduce((sum, s) => sum + s.quantity, 0);
            const dispatched = Math.abs(entries.filter(s => s.type === "Dispatch").reduce((sum, s) => sum + s.quantity, 0));
            const wastage = Math.abs(entries.filter(s => s.type === "Wastage").reduce((sum, s) => sum + s.quantity, 0));
            const closing = entries.reduce((sum, s) => sum + s.quantity, 0);
            return (
              <tr key={p.id} className="border">
                <td className="border py-1 px-2">{p.name}</td>
                <td className="border py-1 px-2 text-right">0</td>
                <td className="border py-1 px-2 text-right">{received}</td>
                <td className="border py-1 px-2 text-right">{dispatched}</td>
                <td className="border py-1 px-2 text-right">{wastage}</td>
                <td className="border py-1 px-2 text-right font-semibold">{closing}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <PageHeader title="Stock Reports" description="Generate stock position and movement reports" />
      <Card className="mb-6"><CardContent className="pt-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div><Label>From</Label><Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-44" /></div>
          <div><Label>To</Label><Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-44" /></div>
          <Button onClick={() => setShowReport(true)}>Generate Report</Button>
        </div>
      </CardContent></Card>
      {showReport && <ReportViewer title="Stock Position Report" pages={[reportPage]} />}
    </div>
  );
};

export default StockReportsPage;
