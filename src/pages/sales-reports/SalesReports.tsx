import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import ReportViewer from "@/components/ReportViewer";
import { products, routes, customers, officers, agents } from "@/data/mockData";

interface SalesReportShellProps {
  title: string;
  description: string;
  reportTitle: string;
  renderPages: (from: string, to: string) => React.ReactNode[];
}

const SalesReportShell: React.FC<SalesReportShellProps> = ({ title, description, reportTitle, renderPages }) => {
  const [fromDate, setFromDate] = useState("2026-04-01");
  const [toDate, setToDate] = useState("2026-04-08");
  const [showReport, setShowReport] = useState(false);

  return (
    <div>
      <PageHeader title={title} description={description} />
      <Card className="mb-6"><CardContent className="pt-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div><Label>From</Label><Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-44" /></div>
          <div><Label>To</Label><Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-44" /></div>
          <Button onClick={() => setShowReport(true)}>Generate</Button>
        </div>
      </CardContent></Card>
      {showReport && <ReportViewer title={reportTitle} pages={renderPages(fromDate, toDate)} />}
    </div>
  );
};

const dmuProducts = products.filter((p) => ["Milk", "Curd", "Lassi", "Buttermilk"].includes(p.category) && !p.terminated);
const activeProducts = products.filter((p) => !p.terminated);

// 12.1 Daily Sales Statement (DMU Items)
export const DailySalesStatement = () => (
  <SalesReportShell title="Daily Sales Statement" description="DMU items daily sales (own production)" reportTitle="Daily Sales Statement — DMU Items"
    renderPages={(from, to) => {
      const dates = ["2026-04-07", "2026-04-08"];
      const page = (
        <div key="p1">
          <div className="text-center mb-4">
            <h2 className="text-sm font-bold uppercase">Haveri Milk Union</h2>
            <p className="text-xs font-semibold">Daily Sales Statement — DMU Items</p>
            <p className="text-xs text-muted-foreground">{from} to {to}</p>
          </div>
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="border">
                <th className="border py-1 px-1 text-left" rowSpan={2}>Date</th>
                {dmuProducts.map((p) => <th key={p.id} className="border py-1 px-1 text-center" colSpan={2}>{p.reportAlias}</th>)}
                <th className="border py-1 px-1 text-right" rowSpan={2}>Grand Total</th>
              </tr>
              <tr className="border">
                {dmuProducts.map((p) => (
                  <><th key={p.id+"q"} className="border py-1 px-1 text-right">Qty</th><th key={p.id+"a"} className="border py-1 px-1 text-right">Amt</th></>
                ))}
              </tr>
            </thead>
            <tbody>
              {dates.map((d) => {
                let grandTotal = 0;
                return (
                  <tr key={d} className="border">
                    <td className="border py-1 px-1">{d}</td>
                    {dmuProducts.map((p) => {
                      const qty = Math.floor(Math.random() * 200) + 50;
                      const amt = qty * (p.rateCategories["Retail-Dealer"] || p.mrp);
                      grandTotal += amt;
                      return <><td key={p.id+"q"} className="border py-1 px-1 text-right">{qty}</td><td key={p.id+"a"} className="border py-1 px-1 text-right">₹{amt.toFixed(0)}</td></>;
                    })}
                    <td className="border py-1 px-1 text-right font-semibold">₹{grandTotal.toFixed(0)}</td>
                  </tr>
                );
              })}
              <tr className="border font-semibold bg-muted/20">
                <td className="border py-1 px-1">TOTAL</td>
                {dmuProducts.map((p) => <><td key={p.id+"q"} className="border py-1 px-1 text-right">-</td><td key={p.id+"a"} className="border py-1 px-1 text-right">-</td></>)}
                <td className="border py-1 px-1 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      return [page];
    }}
  />
);

// 12.2 Day/Route wise cash sales
export const DayRouteCashSales = () => (
  <SalesReportShell title="Day/Route Wise Cash Sales" description="Cash sales breakdown by day and route" reportTitle="Day/Route Wise Cash Sales"
    renderPages={(from, to) => {
      const page = (
        <div key="p1">
          <div className="text-center mb-4">
            <h2 className="text-sm font-bold uppercase">Haveri Milk Union</h2>
            <p className="text-xs font-semibold">Day/Route Wise Cash Sales</p>
            <p className="text-xs text-muted-foreground">{from} to {to}</p>
          </div>
          <table className="w-full text-[10px] border-collapse">
            <thead><tr className="border">
              <th className="border py-1 px-1 text-left">Date</th>
              <th className="border py-1 px-1 text-left">Route</th>
              {activeProducts.slice(0, 5).map((p) => <th key={p.id} className="border py-1 px-1 text-center">{p.reportAlias}</th>)}
              <th className="border py-1 px-1 text-right">Total Qty</th>
              <th className="border py-1 px-1 text-right">Amount</th>
            </tr></thead>
            <tbody>
              {routes.slice(0, 4).map((r) => (
                <tr key={r.id} className="border">
                  <td className="border py-1 px-1">2026-04-08</td>
                  <td className="border py-1 px-1">{r.name}</td>
                  {activeProducts.slice(0, 5).map((p) => {
                    const qty = Math.floor(Math.random() * 60) + 10;
                    return <td key={p.id} className="border py-1 px-1 text-center">{qty}</td>;
                  })}
                  <td className="border py-1 px-1 text-right font-mono">{Math.floor(Math.random() * 200) + 100}</td>
                  <td className="border py-1 px-1 text-right font-mono">₹{(Math.floor(Math.random() * 5000) + 2000).toLocaleString()}</td>
                </tr>
              ))}
              <tr className="border font-semibold bg-muted/20">
                <td className="border py-1 px-1" colSpan={2}>TOTAL</td>
                {activeProducts.slice(0, 5).map((p) => <td key={p.id} className="border py-1 px-1 text-center">-</td>)}
                <td className="border py-1 px-1 text-right">-</td>
                <td className="border py-1 px-1 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      return [page];
    }}
  />
);

// 12.3 Officer wise sales (qty)
export const OfficerWiseSales = () => (
  <SalesReportShell title="Officer Wise Sales (Qty)" description="Sales grouped by officer" reportTitle="Officer Wise Sales Report"
    renderPages={(from, to) => {
      const page = (
        <div key="p1">
          <div className="text-center mb-4">
            <h2 className="text-sm font-bold uppercase">Haveri Milk Union</h2>
            <p className="text-xs font-semibold">Officer Wise Sales (Qty)</p>
            <p className="text-xs text-muted-foreground">{from} to {to}</p>
          </div>
          <table className="w-full text-[10px] border-collapse">
            <thead><tr className="border">
              <th className="border py-1 px-1 text-left">Officer</th>
              {activeProducts.slice(0, 6).map((p) => <th key={p.id} className="border py-1 px-1 text-center">{p.reportAlias}</th>)}
              <th className="border py-1 px-1 text-right">Total Qty</th>
            </tr></thead>
            <tbody>
              {officers.map((o) => {
                let total = 0;
                return (
                  <tr key={o} className="border">
                    <td className="border py-1 px-1">{o}</td>
                    {activeProducts.slice(0, 6).map((p) => {
                      const qty = Math.floor(Math.random() * 100) + 20;
                      total += qty;
                      return <td key={p.id} className="border py-1 px-1 text-center">{qty}</td>;
                    })}
                    <td className="border py-1 px-1 text-right font-semibold">{total}</td>
                  </tr>
                );
              })}
              <tr className="border font-semibold bg-muted/20">
                <td className="border py-1 px-1">TOTAL</td>
                {activeProducts.slice(0, 6).map((p) => <td key={p.id} className="border py-1 px-1 text-center">-</td>)}
                <td className="border py-1 px-1 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      return [page];
    }}
  />
);

// 12.4 Cash Sales
export const CashSalesReport = () => (
  <SalesReportShell title="Cash Sales" description="Daily-payment customers' sales" reportTitle="Cash Sales Report"
    renderPages={(from, to) => {
      const cashCustomers = customers.filter((c) => c.payMode === "Cash" && c.status === "Active");
      const page = (
        <div key="p1">
          <div className="text-center mb-4">
            <h2 className="text-sm font-bold uppercase">Haveri Milk Union</h2>
            <p className="text-xs font-semibold">Cash Sales Report</p>
            <p className="text-xs text-muted-foreground">{from} to {to}</p>
          </div>
          <table className="w-full text-[10px] border-collapse">
            <thead><tr className="border">
              <th className="border py-1 px-1 text-left">Sl</th>
              <th className="border py-1 px-1 text-left">Customer</th>
              <th className="border py-1 px-1 text-left">Route</th>
              {activeProducts.slice(0, 5).map((p) => <th key={p.id} className="border py-1 px-1 text-center">{p.reportAlias}</th>)}
              <th className="border py-1 px-1 text-right">Total Qty</th>
              <th className="border py-1 px-1 text-right">Amount</th>
            </tr></thead>
            <tbody>
              {cashCustomers.map((c, idx) => {
                const route = routes.find((r) => r.id === c.routeId);
                let tq = 0;
                return (
                  <tr key={c.id} className="border">
                    <td className="border py-1 px-1">{idx + 1}</td>
                    <td className="border py-1 px-1">{c.name}</td>
                    <td className="border py-1 px-1">{route?.name}</td>
                    {activeProducts.slice(0, 5).map((p) => {
                      const qty = Math.floor(Math.random() * 40) + 5;
                      tq += qty;
                      return <td key={p.id} className="border py-1 px-1 text-center">{qty}</td>;
                    })}
                    <td className="border py-1 px-1 text-right">{tq}</td>
                    <td className="border py-1 px-1 text-right">₹{(tq * 22).toLocaleString()}</td>
                  </tr>
                );
              })}
              <tr className="border font-semibold bg-muted/20">
                <td className="border py-1 px-1" colSpan={3}>TOTAL</td>
                {activeProducts.slice(0, 5).map((p) => <td key={p.id} className="border py-1 px-1 text-center">-</td>)}
                <td className="border py-1 px-1 text-right">-</td>
                <td className="border py-1 px-1 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      return [page];
    }}
  />
);

// 12.5 Credit Sales
export const CreditSalesReport = () => (
  <SalesReportShell title="Credit Sales" description="Monthly credit institution sales" reportTitle="Credit Sales Report"
    renderPages={(from, to) => {
      const creditCustomers = customers.filter((c) => c.payMode === "Credit" && c.status === "Active");
      return creditCustomers.map((c) => {
        const route = routes.find((r) => r.id === c.routeId);
        return (
          <div key={c.id}>
            <div className="text-center mb-4">
              <h2 className="text-sm font-bold uppercase">Haveri Milk Union</h2>
              <p className="text-xs font-semibold">Credit Sales — {c.name}</p>
              <p className="text-xs text-muted-foreground">{from} to {to} | Route: {route?.name}</p>
            </div>
            <table className="w-full text-[10px] border-collapse">
              <thead><tr className="border">
                <th className="border py-1 px-1 text-left">Date</th>
                {activeProducts.slice(0, 5).map((p) => <th key={p.id} className="border py-1 px-1 text-center">{p.reportAlias}</th>)}
                <th className="border py-1 px-1 text-right">Total Qty</th>
                <th className="border py-1 px-1 text-right">Amount</th>
              </tr></thead>
              <tbody>
                {["2026-04-07", "2026-04-08"].map((d) => {
                  let tq = 0;
                  return (
                    <tr key={d} className="border">
                      <td className="border py-1 px-1">{d}</td>
                      {activeProducts.slice(0, 5).map((p) => {
                        const qty = Math.floor(Math.random() * 30) + 5;
                        tq += qty;
                        return <td key={p.id} className="border py-1 px-1 text-center">{qty}</td>;
                      })}
                      <td className="border py-1 px-1 text-right">{tq}</td>
                      <td className="border py-1 px-1 text-right">₹{(tq * 24).toLocaleString()}</td>
                    </tr>
                  );
                })}
                <tr className="border font-semibold bg-muted/20">
                  <td className="border py-1 px-1">TOTAL</td>
                  {activeProducts.slice(0, 5).map((p) => <td key={p.id} className="border py-1 px-1 text-center">-</td>)}
                  <td className="border py-1 px-1 text-right">-</td>
                  <td className="border py-1 px-1 text-right">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      });
    }}
  />
);

// 12.6 Sales Register
export const SalesRegister = () => (
  <SalesReportShell title="Sales Register" description="Combined cash + credit sales" reportTitle="Sales Register"
    renderPages={(from, to) => {
      const page = (
        <div key="p1">
          <div className="text-center mb-4">
            <h2 className="text-sm font-bold uppercase">Haveri Milk Union</h2>
            <p className="text-xs font-semibold">Sales Register</p>
            <p className="text-xs text-muted-foreground">{from} to {to}</p>
          </div>
          <table className="w-full text-[10px] border-collapse">
            <thead><tr className="border">
              <th className="border py-1 px-1 text-left">Date</th>
              {activeProducts.slice(0, 5).map((p) => <th key={p.id} className="border py-1 px-1 text-center">{p.reportAlias}</th>)}
              <th className="border py-1 px-1 text-right">Cash Sales</th>
              <th className="border py-1 px-1 text-right">Credit Sales</th>
              <th className="border py-1 px-1 text-right">Adhoc</th>
              <th className="border py-1 px-1 text-right">Grand Total</th>
            </tr></thead>
            <tbody>
              {["2026-04-07", "2026-04-08"].map((d) => (
                <tr key={d} className="border">
                  <td className="border py-1 px-1">{d}</td>
                  {activeProducts.slice(0, 5).map((p) => <td key={p.id} className="border py-1 px-1 text-center">{Math.floor(Math.random() * 200) + 50}</td>)}
                  <td className="border py-1 px-1 text-right">₹{(Math.floor(Math.random() * 5000) + 3000).toLocaleString()}</td>
                  <td className="border py-1 px-1 text-right">₹{(Math.floor(Math.random() * 2000) + 1000).toLocaleString()}</td>
                  <td className="border py-1 px-1 text-right">₹{(Math.floor(Math.random() * 1000) + 200).toLocaleString()}</td>
                  <td className="border py-1 px-1 text-right font-semibold">₹{(Math.floor(Math.random() * 8000) + 5000).toLocaleString()}</td>
                </tr>
              ))}
              <tr className="border font-semibold bg-muted/20">
                <td className="border py-1 px-1">TOTAL</td>
                {activeProducts.slice(0, 5).map((p) => <td key={p.id} className="border py-1 px-1 text-center">-</td>)}
                <td className="border py-1 px-1 text-right">-</td>
                <td className="border py-1 px-1 text-right">-</td>
                <td className="border py-1 px-1 text-right">-</td>
                <td className="border py-1 px-1 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      return [page];
    }}
  />
);

// 12.7 Taluka/Agent wise
export const TalukaAgentSales = () => (
  <SalesReportShell title="Taluka/Agent Wise Sales" description="Sales grouped by taluka and agent" reportTitle="Taluka/Agent Wise Sales"
    renderPages={(from, to) => {
      return routes.slice(0, 3).map((route) => (
        <div key={route.id}>
          <div className="text-center mb-4">
            <h2 className="text-sm font-bold uppercase">Haveri Milk Union</h2>
            <p className="text-xs font-semibold">Taluka/Agent Wise Sales — {route.name}</p>
            <p className="text-xs text-muted-foreground">{from} to {to} | Taluka: {route.taluka}</p>
          </div>
          <table className="w-full text-[10px] border-collapse">
            <thead><tr className="border">
              <th className="border py-1 px-1 text-left">Agent</th>
              {activeProducts.slice(0, 5).map((p) => <th key={p.id} className="border py-1 px-1 text-center">{p.reportAlias}</th>)}
              <th className="border py-1 px-1 text-right">Total Qty</th>
              <th className="border py-1 px-1 text-right">Amount</th>
            </tr></thead>
            <tbody>
              {agents.slice(0, 2).map((a) => {
                let tq = 0;
                return (
                  <tr key={a.code} className="border">
                    <td className="border py-1 px-1">{a.name}</td>
                    {activeProducts.slice(0, 5).map((p) => {
                      const qty = Math.floor(Math.random() * 80) + 10;
                      tq += qty;
                      return <td key={p.id} className="border py-1 px-1 text-center">{qty}</td>;
                    })}
                    <td className="border py-1 px-1 text-right">{tq}</td>
                    <td className="border py-1 px-1 text-right">₹{(tq * 22).toLocaleString()}</td>
                  </tr>
                );
              })}
              <tr className="border font-semibold bg-muted/20">
                <td className="border py-1 px-1">TOTAL</td>
                {activeProducts.slice(0, 5).map((p) => <td key={p.id} className="border py-1 px-1 text-center">-</td>)}
                <td className="border py-1 px-1 text-right">-</td>
                <td className="border py-1 px-1 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      ));
    }}
  />
);

// 12.8 Adhoc Sales
export const AdhocSalesReport = () => (
  <SalesReportShell title="Adhoc Sales Abstract" description="Emergency/ad-hoc sales summary" reportTitle="Adhoc Sales Abstract"
    renderPages={(from, to) => {
      const page = (
        <div key="p1">
          <div className="text-center mb-4">
            <h2 className="text-sm font-bold uppercase">Haveri Milk Union</h2>
            <p className="text-xs font-semibold">Adhoc Sales Abstract</p>
            <p className="text-xs text-muted-foreground">{from} to {to}</p>
          </div>
          <table className="w-full text-[10px] border-collapse">
            <thead><tr className="border">
              <th className="border py-1 px-1 text-left">Date</th>
              <th className="border py-1 px-1 text-left">GP No.</th>
              <th className="border py-1 px-1 text-left">Agent/Customer</th>
              {activeProducts.slice(0, 5).map((p) => <th key={p.id} className="border py-1 px-1 text-center">{p.reportAlias}</th>)}
              <th className="border py-1 px-1 text-right">Total Qty</th>
              <th className="border py-1 px-1 text-right">Amount</th>
            </tr></thead>
            <tbody>
              {agents.slice(0, 3).map((a, i) => {
                let tq = 0;
                return (
                  <tr key={a.code} className="border">
                    <td className="border py-1 px-1">2026-04-08</td>
                    <td className="border py-1 px-1">GP-00{i + 1}</td>
                    <td className="border py-1 px-1">{a.name}</td>
                    {activeProducts.slice(0, 5).map((p) => {
                      const qty = Math.floor(Math.random() * 20) + 5;
                      tq += qty;
                      return <td key={p.id} className="border py-1 px-1 text-center">{qty}</td>;
                    })}
                    <td className="border py-1 px-1 text-right">{tq}</td>
                    <td className="border py-1 px-1 text-right">₹{(tq * 22).toLocaleString()}</td>
                  </tr>
                );
              })}
              <tr className="border font-semibold bg-muted/20">
                <td className="border py-1 px-1" colSpan={3}>TOTAL</td>
                {activeProducts.slice(0, 5).map((p) => <td key={p.id} className="border py-1 px-1 text-center">-</td>)}
                <td className="border py-1 px-1 text-right">-</td>
                <td className="border py-1 px-1 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      return [page];
    }}
  />
);

// 13. GST Sales Statement
export const GSTStatement = () => (
  <SalesReportShell title="GST Sales Statement" description="GST-compliant sales with tax breakdowns" reportTitle="GST Sales Statement"
    renderPages={(from, to) => {
      const page = (
        <div key="p1">
          <div className="text-center mb-4">
            <h2 className="text-sm font-bold uppercase">Haveri Milk Union</h2>
            <p className="text-xs font-semibold">GST Sales Statement</p>
            <p className="text-xs text-muted-foreground">{from} to {to}</p>
          </div>
          <table className="w-full text-[10px] border-collapse">
            <thead><tr className="border">
              <th className="border py-1 px-1 text-left">Product</th>
              <th className="border py-1 px-1 text-left">HSN</th>
              <th className="border py-1 px-1 text-right">Qty</th>
              <th className="border py-1 px-1 text-right">GST%</th>
              <th className="border py-1 px-1 text-right">Taxable Value</th>
              <th className="border py-1 px-1 text-right">CGST</th>
              <th className="border py-1 px-1 text-right">SGST</th>
              <th className="border py-1 px-1 text-right">Total Tax</th>
              <th className="border py-1 px-1 text-right">Invoice Value</th>
            </tr></thead>
            <tbody>
              {activeProducts.map((p) => {
                const qty = Math.floor(Math.random() * 300) + 50;
                const rate = p.rateCategories["Retail-Dealer"] || p.mrp;
                const taxable = qty * rate / (1 + p.gstPercent / 100);
                const cgst = taxable * (p.cgst / 100);
                const sgst = taxable * (p.sgst / 100);
                const totalTax = cgst + sgst;
                const invoice = taxable + totalTax;
                return (
                  <tr key={p.id} className="border">
                    <td className="border py-1 px-1">{p.reportAlias}</td>
                    <td className="border py-1 px-1">{p.hsnNo}</td>
                    <td className="border py-1 px-1 text-right">{qty}</td>
                    <td className="border py-1 px-1 text-right">{p.gstPercent}%</td>
                    <td className="border py-1 px-1 text-right">₹{taxable.toFixed(2)}</td>
                    <td className="border py-1 px-1 text-right">₹{cgst.toFixed(2)}</td>
                    <td className="border py-1 px-1 text-right">₹{sgst.toFixed(2)}</td>
                    <td className="border py-1 px-1 text-right">₹{totalTax.toFixed(2)}</td>
                    <td className="border py-1 px-1 text-right font-semibold">₹{invoice.toFixed(2)}</td>
                  </tr>
                );
              })}
              <tr className="border font-semibold bg-muted/20">
                <td className="border py-1 px-1" colSpan={4}>TOTAL</td>
                <td className="border py-1 px-1 text-right">-</td>
                <td className="border py-1 px-1 text-right">-</td>
                <td className="border py-1 px-1 text-right">-</td>
                <td className="border py-1 px-1 text-right">-</td>
                <td className="border py-1 px-1 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      return [page];
    }}
  />
);
