import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReportViewer from "@/components/ReportViewer";
import { batches, routes, customers, products, indents } from "@/data/mockData";

const RouteSheetPage = () => {
  const [batch, setBatch] = useState("");
  const [date, setDate] = useState("2026-04-08");
  const [showReport, setShowReport] = useState(false);

  const acrossProducts = products.filter((p) => p.printDirection === "Across" && !p.terminated);
  const downProducts = products.filter((p) => p.printDirection === "Down" && !p.terminated);

  const generatePages = () => {
    return routes.map((route) => {
      const routeCustomers = customers.filter((c) => c.routeId === route.id && c.status === "Active");
      const routeIndents = indents.filter((i) => i.routeId === route.id && i.date === date);

      return (
        <div key={route.id}>
          <div className="text-center mb-3">
            <h2 className="text-sm font-bold uppercase">Haveri Milk Union — Route Sheet</h2>
            <p className="text-xs">{route.name} | Date: {date} | Batch: {batches.find((b) => b.id === batch)?.name || "All"}</p>
          </div>
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="border">
                <th className="border py-1 px-1 text-left">Sl</th>
                <th className="border py-1 px-1 text-left">Customer</th>
                {acrossProducts.map((p) => <th key={p.id} className="border py-1 px-1 text-center">{p.reportAlias}</th>)}
                <th className="border py-1 px-1 text-center">Others</th>
                <th className="border py-1 px-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {routeCustomers.map((cust, idx) => {
                const custIndent = routeIndents.find((i) => i.customerId === cust.id);
                const getQty = (pId: string) => custIndent?.items.find((it) => it.productId === pId)?.quantity || 0;
                const othersQty = downProducts.reduce((s, p) => s + getQty(p.id), 0);
                const total = acrossProducts.reduce((s, p) => s + getQty(p.id), 0) + othersQty;
                return (
                  <tr key={cust.id} className="border">
                    <td className="border py-1 px-1">{idx + 1}</td>
                    <td className="border py-1 px-1">{cust.name}</td>
                    {acrossProducts.map((p) => <td key={p.id} className="border py-1 px-1 text-center">{getQty(p.id) || ""}</td>)}
                    <td className="border py-1 px-1 text-center">{othersQty || ""}</td>
                    <td className="border py-1 px-1 text-right font-semibold">{total || ""}</td>
                  </tr>
                );
              })}
              {/* Totals row */}
              <tr className="border font-semibold bg-muted/20">
                <td className="border py-1 px-1" colSpan={2}>TOTAL</td>
                {acrossProducts.map((p) => {
                  const colTotal = routeCustomers.reduce((s, c) => {
                    const ind = routeIndents.find((i) => i.customerId === c.id);
                    return s + (ind?.items.find((it) => it.productId === p.id)?.quantity || 0);
                  }, 0);
                  return <td key={p.id} className="border py-1 px-1 text-center">{colTotal || ""}</td>;
                })}
                <td className="border py-1 px-1 text-center">-</td>
                <td className="border py-1 px-1 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    });
  };

  return (
    <div>
      <PageHeader title="Route Sheet" description="Generate and print route-wise delivery sheets" />
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div><Label>Batch</Label>
              <Select value={batch} onValueChange={setBatch}>
                <SelectTrigger className="w-52"><SelectValue placeholder="All batches" /></SelectTrigger>
                <SelectContent>{batches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-44" /></div>
            <Button onClick={() => setShowReport(true)}>Generate</Button>
          </div>
        </CardContent>
      </Card>
      {showReport && <ReportViewer title="Route Sheet" pages={generatePages()} />}
    </div>
  );
};

export default RouteSheetPage;
