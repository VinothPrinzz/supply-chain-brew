import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import ReportViewer from "@/components/ReportViewer";
import { products, routes, customers, officers, agents, contractors } from "@/data/mockData";

interface SalesReportShellProps {
  title: string;
  description: string;
  reportTitle: string;
  renderPages: (from: string, to: string) => React.ReactNode[];
}

const SalesReportShell: React.FC<SalesReportShellProps> = ({ title, description, reportTitle, renderPages }) => {
  const [fromDate, setFromDate] = useState("2026-03-01");
  const [toDate, setToDate] = useState("2026-03-31");
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

const activeProducts = products.filter((p) => !p.terminated);
const milkProducts = activeProducts.filter((p) => p.category === "Milk");
const curdProducts = activeProducts.filter((p) => p.category === "Curd");
const lassiMajigeProducts = activeProducts.filter((p) => ["Lassi", "Buttermilk"].includes(p.category));

// Helper: generate array of dates between from/to
const getDates = (from: string, to: string): string[] => {
  const dates: string[] = [];
  const d = new Date(from);
  const end = new Date(to);
  while (d <= end) {
    dates.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return dates;
};

// Helper: seeded random for consistent mock data
const seededRand = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};
const mockQty = (seed: number, max = 100) => Math.floor(seededRand(seed) * max) + 5;

// Report header component
const ReportHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="text-center mb-3">
    <h2 className="text-sm font-bold uppercase tracking-wide">HAVERI MILK UNION LTD — HAVERI</h2>
    <p className="text-xs font-bold mt-1">{title}</p>
    {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>}
  </div>
);

// =============================================
// 1. Daily Sales Statement (DMU Items)
// Segregated: Milk page, Curd page, Lassi/Majige page
// Columns: Date, Product qty columns, Total Amount
// =============================================
export const DailySalesStatement = () => (
  <SalesReportShell title="Daily Sales Statement" description="DMU items daily sales (own production)" reportTitle="Daily Sales Statement — DMU Items"
    renderPages={(from, to) => {
      const dates = getDates(from, to);
      const groups = [
        { label: "Milk Items", prods: milkProducts },
        { label: "Curd Items", prods: curdProducts },
        { label: "Lassi & Majige Items", prods: lassiMajigeProducts },
      ].filter(g => g.prods.length > 0);

      return groups.map((group, gi) => {
        const prodTotals: Record<string, number> = {};
        group.prods.forEach(p => { prodTotals[p.id] = 0; });
        let grandTotalSum = 0;

        return (
          <div key={gi}>
            <ReportHeader title={`Daily Sales Statement — ${group.label}`} subtitle={`Period: ${from} to ${to}`} />
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="border bg-muted/30">
                  <th className="border py-1.5 px-2 text-left font-bold">Date</th>
                  {group.prods.map(p => (
                    <th key={p.id} className="border py-1.5 px-2 text-center font-bold">{p.reportAlias}</th>
                  ))}
                  <th className="border py-1.5 px-2 text-right font-bold">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {dates.map((d, di) => {
                  let rowTotal = 0;
                  return (
                    <tr key={d} className="border">
                      <td className="border py-1 px-2 font-medium">{new Date(d).getDate().toString().padStart(2, '0')}</td>
                      {group.prods.map((p, pi) => {
                        const qty = mockQty(di * 100 + pi + gi * 1000, 150);
                        prodTotals[p.id] += qty;
                        const amt = qty * (p.rateCategories["Retail-Dealer"] || p.mrp);
                        rowTotal += amt;
                        return <td key={p.id} className="border py-1 px-2 text-center">{qty}</td>;
                      })}
                      {(() => { grandTotalSum += rowTotal; return null; })()}
                      <td className="border py-1 px-2 text-right font-medium">₹{rowTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr className="border font-bold bg-muted/30">
                  <td className="border py-1.5 px-2">TOTAL</td>
                  {group.prods.map(p => (
                    <td key={p.id} className="border py-1.5 px-2 text-center">{prodTotals[p.id]}</td>
                  ))}
                  <td className="border py-1.5 px-2 text-right">₹{grandTotalSum.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      });
    }}
  />
);

// =============================================
// 2. Day/Route Wise Cash Sales
// Columns: Indent Date, Route Name (span showing total amount)
// =============================================
export const DayRouteCashSales = () => (
  <SalesReportShell title="Day/Route Wise Cash Sales" description="Cash sales breakdown by day and route" reportTitle="Day/Route Wise Cash Sales"
    renderPages={(from, to) => {
      const dates = getDates(from, to);
      const activeRoutes = routes.filter(r => r.status === "Active");
      const routeTotals: Record<string, number> = {};
      activeRoutes.forEach(r => { routeTotals[r.id] = 0; });

      const page = (
        <div key="p1">
          <ReportHeader title="Day/Route Wise Cash Sales" subtitle={`Period: ${from} to ${to}`} />
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="border bg-muted/30">
                <th className="border py-1.5 px-2 text-left font-bold">Indent Date</th>
                {activeRoutes.map(r => (
                  <th key={r.id} className="border py-1.5 px-2 text-center font-bold">{r.name}</th>
                ))}
                <th className="border py-1.5 px-2 text-right font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {dates.map((d, di) => {
                let dayTotal = 0;
                return (
                  <tr key={d} className="border">
                    <td className="border py-1 px-2 font-medium">{d}</td>
                    {activeRoutes.map((r, ri) => {
                      const amt = mockQty(di * 50 + ri, 8000) + 1000;
                      routeTotals[r.id] += amt;
                      dayTotal += amt;
                      return <td key={r.id} className="border py-1 px-2 text-center">₹{amt.toLocaleString()}</td>;
                    })}
                    <td className="border py-1 px-2 text-right font-bold">₹{dayTotal.toLocaleString()}</td>
                  </tr>
                );
              })}
              <tr className="border font-bold bg-muted/30">
                <td className="border py-1.5 px-2">TOTAL</td>
                {activeRoutes.map(r => (
                  <td key={r.id} className="border py-1.5 px-2 text-center">₹{routeTotals[r.id].toLocaleString()}</td>
                ))}
                <td className="border py-1.5 px-2 text-right">₹{Object.values(routeTotals).reduce((a, b) => a + b, 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      return [page];
    }}
  />
);

// =============================================
// 3. Officer Wise Sales (Qty)
// Columns: Products (rows), Officer Name (span columns), Total
// =============================================
export const OfficerWiseSales = () => (
  <SalesReportShell title="Officer Wise Sales (Qty)" description="Sales grouped by officer" reportTitle="Officer Wise Sales Report"
    renderPages={(from, to) => {
      const officerTotals: Record<string, number> = {};
      officers.forEach(o => { officerTotals[o] = 0; });
      let grandTotal = 0;

      const page = (
        <div key="p1">
          <ReportHeader title="Officer Wise Sales Report (Qty)" subtitle={`Period: ${from} to ${to}`} />
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="border bg-muted/30">
                <th className="border py-1.5 px-2 text-left font-bold">Product</th>
                {officers.map(o => (
                  <th key={o} className="border py-1.5 px-2 text-center font-bold">{o}</th>
                ))}
                <th className="border py-1.5 px-2 text-right font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {activeProducts.map((p, pi) => {
                let rowTotal = 0;
                return (
                  <tr key={p.id} className="border">
                    <td className="border py-1 px-2 font-medium">{p.reportAlias}</td>
                    {officers.map((o, oi) => {
                      const qty = mockQty(pi * 10 + oi, 200);
                      officerTotals[o] += qty;
                      rowTotal += qty;
                      return <td key={o} className="border py-1 px-2 text-center">{qty}</td>;
                    })}
                    {(() => { grandTotal += rowTotal; return null; })()}
                    <td className="border py-1 px-2 text-right font-bold">{rowTotal}</td>
                  </tr>
                );
              })}
              <tr className="border font-bold bg-muted/30">
                <td className="border py-1.5 px-2">TOTAL</td>
                {officers.map(o => (
                  <td key={o} className="border py-1.5 px-2 text-center">{officerTotals[o]}</td>
                ))}
                <td className="border py-1.5 px-2 text-right">{grandTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      return [page];
    }}
  />
);

// =============================================
// 4. Cash Sales Statement
// Page 1: Route Code, Route Name, Products span, Total
// Page 2: Route Code, Route Name, Milk Amount, Product Amount, Total, Contractor
// =============================================
export const CashSalesReport = () => (
  <SalesReportShell title="Cash Sales" description="Daily-payment customers' sales" reportTitle="Cash Sales Statement"
    renderPages={(from, to) => {
      const activeRoutes = routes.filter(r => r.status === "Active");

      // Page 1: products breakdown
      const routeProdTotals: Record<string, Record<string, number>> = {};
      const prodColTotals: Record<string, number> = {};
      activeProducts.forEach(p => { prodColTotals[p.id] = 0; });
      let page1GrandTotal = 0;

      const page1 = (
        <div key="p1">
          <ReportHeader title="Cash Sales Statement — Product Wise" subtitle={`Period: ${from} to ${to}`} />
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="border bg-muted/30">
                <th className="border py-1.5 px-1 text-left font-bold">Code</th>
                <th className="border py-1.5 px-1 text-left font-bold">Route Name</th>
                {activeProducts.map(p => (
                  <th key={p.id} className="border py-1.5 px-1 text-center font-bold whitespace-nowrap">{p.reportAlias}</th>
                ))}
                <th className="border py-1.5 px-1 text-right font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {activeRoutes.map((r, ri) => {
                let rowTotal = 0;
                return (
                  <tr key={r.id} className="border">
                    <td className="border py-1 px-1 font-mono font-medium">{r.code}</td>
                    <td className="border py-1 px-1 font-medium">{r.name}</td>
                    {activeProducts.map((p, pi) => {
                      const qty = mockQty(ri * 20 + pi, 120);
                      const amt = qty * (p.rateCategories["Retail-Dealer"] || p.mrp);
                      prodColTotals[p.id] += amt;
                      rowTotal += amt;
                      return <td key={p.id} className="border py-1 px-1 text-center">{qty}</td>;
                    })}
                    {(() => { page1GrandTotal += rowTotal; return null; })()}
                    <td className="border py-1 px-1 text-right font-bold">₹{rowTotal.toLocaleString()}</td>
                  </tr>
                );
              })}
              <tr className="border font-bold bg-muted/30">
                <td className="border py-1.5 px-1" colSpan={2}>TOTAL</td>
                {activeProducts.map(p => (
                  <td key={p.id} className="border py-1.5 px-1 text-center">₹{prodColTotals[p.id].toLocaleString()}</td>
                ))}
                <td className="border py-1.5 px-1 text-right">₹{page1GrandTotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );

      // Page 2: summary with milk amount vs product amount
      let p2GrandTotal = 0;
      const page2 = (
        <div key="p2">
          <ReportHeader title="Cash Sales Statement — Summary" subtitle={`Period: ${from} to ${to}`} />
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="border bg-muted/30">
                <th className="border py-1.5 px-2 text-left font-bold">Code</th>
                <th className="border py-1.5 px-2 text-left font-bold">Route Name</th>
                <th className="border py-1.5 px-2 text-right font-bold">Milk Amount</th>
                <th className="border py-1.5 px-2 text-right font-bold">Product Amount</th>
                <th className="border py-1.5 px-2 text-right font-bold">Total</th>
                <th className="border py-1.5 px-2 text-left font-bold">Contractor</th>
              </tr>
            </thead>
            <tbody>
              {activeRoutes.map((r, ri) => {
                const milkAmt = mockQty(ri * 7, 5000) + 2000;
                const prodAmt = mockQty(ri * 13, 3000) + 500;
                const total = milkAmt + prodAmt;
                p2GrandTotal += total;
                const ct = contractors.find(c => c.id === r.contractorId);
                return (
                  <tr key={r.id} className="border">
                    <td className="border py-1 px-2 font-mono font-medium">{r.code}</td>
                    <td className="border py-1 px-2 font-medium">{r.name}</td>
                    <td className="border py-1 px-2 text-right">₹{milkAmt.toLocaleString()}</td>
                    <td className="border py-1 px-2 text-right">₹{prodAmt.toLocaleString()}</td>
                    <td className="border py-1 px-2 text-right font-bold">₹{total.toLocaleString()}</td>
                    <td className="border py-1 px-2">{ct?.name || "-"}</td>
                  </tr>
                );
              })}
              <tr className="border font-bold bg-muted/30">
                <td className="border py-1.5 px-2" colSpan={2}>TOTAL</td>
                <td className="border py-1.5 px-2 text-right">-</td>
                <td className="border py-1.5 px-2 text-right">-</td>
                <td className="border py-1.5 px-2 text-right">₹{p2GrandTotal.toLocaleString()}</td>
                <td className="border py-1.5 px-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      );

      return [page1, page2];
    }}
  />
);

// =============================================
// 5. Credit Sales — per customer bill + summary
// Per-customer pages: header with customer info, BILL NO, PERIOD
// Product columns with HSN/Rate, daily qty rows, totals (Pkts, Kg/ltr, BASIC, CGST, SGST, Amount)
// Last page: Summary (Sl No, Code, Name, Total)
// =============================================
export const CreditSalesReport = () => (
  <SalesReportShell title="Credit Sales" description="Monthly credit institution sales" reportTitle="Credit Sales Report"
    renderPages={(from, to) => {
      const creditCustomers = customers.filter(c => c.payMode === "Credit" && c.status === "Active");
      const dates = getDates(from, to);
      // Pick 3 products per customer for the bill format
      const billProducts = activeProducts.slice(0, 3);

      const customerPages = creditCustomers.map((cust, ci) => {
        const route = routes.find(r => r.id === cust.routeId);
        const billNo = `${cust.code}\\${new Date(from).getMonth() + 1}\\${String(new Date(from).getFullYear()).slice(2)}`;

        // Generate daily data
        const dailyData = dates.map((d, di) => {
          return billProducts.map((p, pi) => mockQty(ci * 1000 + di * 10 + pi, 10));
        });

        // Column totals
        const pktTotals = billProducts.map((_, pi) => dailyData.reduce((s, row) => s + row[pi], 0));
        const kgLtrTotals = billProducts.map((p, pi) => (pktTotals[pi] * p.packSize));
        const basicTotals = billProducts.map((p, pi) => {
          const rate = p.rateCategories[cust.rateCategory] || p.mrp;
          return pktTotals[pi] * rate;
        });
        const cgstTotals = billProducts.map((p, pi) => basicTotals[pi] * (p.cgst / 100));
        const sgstTotals = billProducts.map((p, pi) => basicTotals[pi] * (p.sgst / 100));
        const amountTotals = billProducts.map((_, pi) => basicTotals[pi] + cgstTotals[pi] + sgstTotals[pi]);
        const grandTotal = amountTotals.reduce((s, v) => s + v, 0);

        return (
          <div key={cust.id} className="text-[10px]">
            {/* Header mimicking legacy format */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-xs">[ H A V E M U L ]</p>
                <div className="mt-1 text-[10px]">
                  <p><strong>To,</strong> {cust.name}</p>
                  <p className="ml-6">{cust.address}</p>
                  <p className="ml-6">{cust.city}</p>
                </div>
                <div className="mt-1">
                  <p><strong>BILL NO</strong>&nbsp;&nbsp;&nbsp;{billNo}</p>
                  <p><strong>PERIOD</strong>&nbsp;&nbsp;&nbsp;{from.split('-').reverse().join('-')} {to.split('-').reverse().join('-')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-xs">HAVERI MILK UNION LTD — HAVERI</p>
                <div className="mt-1 text-[9px] max-w-[220px] text-right">
                  <p>Buyer's GSTIN :</p>
                  <p>TAX INVOICE/CR.BILL GSTIN : 29AADAH7841L1Z6 FSSAI NO:11223999000033</p>
                  <p>DECLARATION UNDER GST Act 2017.</p>
                  <p>We declare that we are the first seller in the state liable to tax under GST Act 2017 and that we shall pay the single point tax on above sale.</p>
                </div>
              </div>
            </div>

            {/* Product header row */}
            <table className="w-full border-collapse mt-2">
              <thead>
                <tr>
                  <td className="py-0.5 px-1"></td>
                  {billProducts.map(p => (
                    <td key={p.id} className="py-0.5 px-1 text-center font-bold border-b">
                      <div className="text-[9px] text-muted-foreground">{p.category.toUpperCase()}</div>
                      <div className="font-bold">{p.name.split(' ').slice(-1)[0] === "500ml" ? p.reportAlias : p.reportAlias}</div>
                    </td>
                  ))}
                  <td className="py-0.5 px-1"></td>
                </tr>
                <tr className="border-b">
                  <td className="py-0.5 px-1 font-bold">HSN</td>
                  {billProducts.map(p => (
                    <td key={p.id} className="py-0.5 px-1 text-center">{p.hsnNo}</td>
                  ))}
                  <td className="py-0.5 px-1"></td>
                </tr>
                <tr className="border-b">
                  <td className="py-0.5 px-1 font-bold">Rate</td>
                  {billProducts.map(p => (
                    <td key={p.id} className="py-0.5 px-1 text-center">{(p.rateCategories[cust.rateCategory] || p.mrp).toFixed(2)}</td>
                  ))}
                  <td className="py-0.5 px-1"></td>
                </tr>
                <tr className="border-b">
                  <td className="py-0.5 px-1 font-bold">Date</td>
                  {billProducts.map(p => (
                    <td key={p.id} className="py-0.5 px-1 text-center font-bold">Qty</td>
                  ))}
                  <td className="py-0.5 px-1 text-right font-bold">Total Amount</td>
                </tr>
              </thead>
              <tbody>
                {dates.map((d, di) => {
                  const dayAmounts = billProducts.map((p, pi) => {
                    const qty = dailyData[di][pi];
                    const rate = p.rateCategories[cust.rateCategory] || p.mrp;
                    return qty * rate;
                  });
                  const dayTotal = dayAmounts.reduce((s, v) => s + v, 0);
                  return (
                    <tr key={d}>
                      <td className="py-0.5 px-1">{new Date(d).getDate().toString().padStart(2, '0')}</td>
                      {billProducts.map((p, pi) => (
                        <td key={p.id} className="py-0.5 px-1 text-center">{dailyData[di][pi] || ""}</td>
                      ))}
                      <td className="py-0.5 px-1 text-right">{dayTotal > 0 ? dayTotal.toFixed(2) : ""}</td>
                    </tr>
                  );
                })}
                {/* Totals */}
                <tr className="border-t font-bold">
                  <td className="py-0.5 px-1">Pkts</td>
                  {pktTotals.map((t, i) => <td key={i} className="py-0.5 px-1 text-center">{t}</td>)}
                  <td className="py-0.5 px-1"></td>
                </tr>
                <tr className="font-bold">
                  <td className="py-0.5 px-1">Kg\ltr</td>
                  {kgLtrTotals.map((t, i) => <td key={i} className="py-0.5 px-1 text-center">{t.toFixed(1)}</td>)}
                  <td className="py-0.5 px-1"></td>
                </tr>
                <tr className="font-bold">
                  <td className="py-0.5 px-1">BASIC</td>
                  {basicTotals.map((t, i) => <td key={i} className="py-0.5 px-1 text-center">{t.toFixed(2)}</td>)}
                  <td className="py-0.5 px-1 text-right font-bold border-t">{basicTotals.reduce((s, v) => s + v, 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-0.5 px-1 font-bold">CGST</td>
                  {cgstTotals.map((t, i) => <td key={i} className="py-0.5 px-1 text-center">{t.toFixed(3)}</td>)}
                  <td className="py-0.5 px-1 text-right">{cgstTotals.reduce((s, v) => s + v, 0).toFixed(3)}</td>
                </tr>
                <tr>
                  <td className="py-0.5 px-1 font-bold">SGST</td>
                  {sgstTotals.map((t, i) => <td key={i} className="py-0.5 px-1 text-center">{t.toFixed(3)}</td>)}
                  <td className="py-0.5 px-1 text-right">{sgstTotals.reduce((s, v) => s + v, 0).toFixed(3)}</td>
                </tr>
                <tr className="border-t font-bold">
                  <td className="py-0.5 px-1">Amount</td>
                  {amountTotals.map((t, i) => <td key={i} className="py-0.5 px-1 text-center">{t.toFixed(2)}</td>)}
                  <td className="py-0.5 px-1 text-right border-t border-b font-bold">{grandTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 text-[9px] flex justify-between">
              <div>
                <p>NOTE: - Kindly acknowledge receipt of this bill immediately.</p>
                <p>- Variation in the above bill if any may be intimated within 15 days.</p>
                <p>- Demand Draft should be issued in favour of "THE MANAGING DIRECTOR HAVERI"</p>
                <p className="mt-1 font-bold">CO-OP MILK PRODUCERS SOCIETIES UNION LTD., HAVERI.</p>
              </div>
              <div className="text-right font-bold">AUTHORISED SIGNATURE.</div>
            </div>
          </div>
        );
      });

      // Summary page (last page)
      let summaryTotal = 0;
      const summaryPage = (
        <div key="summary">
          <ReportHeader title="Credit Sales — Summary" subtitle={`Period: ${from} to ${to}`} />
          <p className="text-xs font-bold mb-3">Summary</p>
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="border bg-muted/30">
                <th className="border py-1.5 px-2 text-left font-bold">Sl No.</th>
                <th className="border py-1.5 px-2 text-left font-bold">Code</th>
                <th className="border py-1.5 px-2 text-left font-bold">Name</th>
                <th className="border py-1.5 px-2 text-right font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {creditCustomers.map((c, i) => {
                const total = mockQty(i * 77, 50000) + 5000;
                summaryTotal += total;
                return (
                  <tr key={c.id} className="border">
                    <td className="border py-1 px-2">{i + 1}</td>
                    <td className="border py-1 px-2 font-mono font-medium">{c.code}</td>
                    <td className="border py-1 px-2 font-medium">{c.name.toUpperCase()}</td>
                    <td className="border py-1 px-2 text-right">{total.toFixed(2)}</td>
                  </tr>
                );
              })}
              <tr className="border font-bold bg-muted/30">
                <td className="border py-1.5 px-2" colSpan={3}>Total</td>
                <td className="border py-1.5 px-2 text-right">{summaryTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );

      return [...customerPages, summaryPage];
    }}
  />
);

// =============================================
// 6. Sales Register
// Page 1: Route Code, Route Name, Products span, Total
// Page 2: Route Code, Route Name, Milk Amount, Product Amount, Total Amount, Contractor Name
// =============================================
export const SalesRegister = () => (
  <SalesReportShell title="Sales Register" description="Combined cash + credit sales" reportTitle="Sales Register"
    renderPages={(from, to) => {
      const activeRoutes = routes.filter(r => r.status === "Active");
      const prodColTotals: Record<string, number> = {};
      activeProducts.forEach(p => { prodColTotals[p.id] = 0; });
      let p1Total = 0;

      const page1 = (
        <div key="p1">
          <ReportHeader title="Sales Register — Product Wise" subtitle={`Period: ${from} to ${to}`} />
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="border bg-muted/30">
                <th className="border py-1.5 px-1 text-left font-bold">Code</th>
                <th className="border py-1.5 px-1 text-left font-bold">Route Name</th>
                {activeProducts.map(p => (
                  <th key={p.id} className="border py-1.5 px-1 text-center font-bold whitespace-nowrap">{p.reportAlias}</th>
                ))}
                <th className="border py-1.5 px-1 text-right font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {activeRoutes.map((r, ri) => {
                let rowTotal = 0;
                return (
                  <tr key={r.id} className="border">
                    <td className="border py-1 px-1 font-mono font-medium">{r.code}</td>
                    <td className="border py-1 px-1 font-medium">{r.name}</td>
                    {activeProducts.map((p, pi) => {
                      const qty = mockQty(ri * 30 + pi + 500, 150);
                      const amt = qty * (p.rateCategories["Retail-Dealer"] || p.mrp);
                      prodColTotals[p.id] += amt;
                      rowTotal += amt;
                      return <td key={p.id} className="border py-1 px-1 text-center">{qty}</td>;
                    })}
                    {(() => { p1Total += rowTotal; return null; })()}
                    <td className="border py-1 px-1 text-right font-bold">₹{rowTotal.toLocaleString()}</td>
                  </tr>
                );
              })}
              <tr className="border font-bold bg-muted/30">
                <td className="border py-1.5 px-1" colSpan={2}>TOTAL</td>
                {activeProducts.map(p => (
                  <td key={p.id} className="border py-1.5 px-1 text-center">₹{prodColTotals[p.id].toLocaleString()}</td>
                ))}
                <td className="border py-1.5 px-1 text-right">₹{p1Total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );

      let p2Total = 0;
      const page2 = (
        <div key="p2">
          <ReportHeader title="Sales Register — Summary" subtitle={`Period: ${from} to ${to}`} />
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="border bg-muted/30">
                <th className="border py-1.5 px-2 text-left font-bold">Code</th>
                <th className="border py-1.5 px-2 text-left font-bold">Route Name</th>
                <th className="border py-1.5 px-2 text-right font-bold">Milk Amount</th>
                <th className="border py-1.5 px-2 text-right font-bold">Product Amount</th>
                <th className="border py-1.5 px-2 text-right font-bold">Total Amount</th>
                <th className="border py-1.5 px-2 text-left font-bold">Contractor Name</th>
              </tr>
            </thead>
            <tbody>
              {activeRoutes.map((r, ri) => {
                const milkAmt = mockQty(ri * 11 + 200, 8000) + 3000;
                const prodAmt = mockQty(ri * 17 + 300, 4000) + 1000;
                const total = milkAmt + prodAmt;
                p2Total += total;
                const ct = contractors.find(c => c.id === r.contractorId);
                return (
                  <tr key={r.id} className="border">
                    <td className="border py-1 px-2 font-mono font-medium">{r.code}</td>
                    <td className="border py-1 px-2 font-medium">{r.name}</td>
                    <td className="border py-1 px-2 text-right">₹{milkAmt.toLocaleString()}</td>
                    <td className="border py-1 px-2 text-right">₹{prodAmt.toLocaleString()}</td>
                    <td className="border py-1 px-2 text-right font-bold">₹{total.toLocaleString()}</td>
                    <td className="border py-1 px-2">{ct?.name || "-"}</td>
                  </tr>
                );
              })}
              <tr className="border font-bold bg-muted/30">
                <td className="border py-1.5 px-2" colSpan={2}>TOTAL</td>
                <td className="border py-1.5 px-2 text-right">-</td>
                <td className="border py-1.5 px-2 text-right">-</td>
                <td className="border py-1.5 px-2 text-right">₹{p2Total.toLocaleString()}</td>
                <td className="border py-1.5 px-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      );

      return [page1, page2];
    }}
  />
);

// =============================================
// 7. Taluka/Agent Wise Sales
// Page 1 per taluka: Taluka Name at top, S.No, Code, Customer Name, Products span, Total
// Page 2 per taluka: S.No, Code, Customer Name, specific product columns, milk total, curd total, total amount
// =============================================
export const TalukaAgentSales = () => (
  <SalesReportShell title="Taluka/Agent Wise Sales" description="Sales grouped by taluka and agent" reportTitle="Taluka/Agent Wise Sales"
    renderPages={(from, to) => {
      const talukas = [...new Set(routes.map(r => r.taluka))];
      const specialProducts = [
        { name: "Cookies 20gms", alias: "Cookies 20g" },
        { name: "100gm Butter Cookies", alias: "Butter Cookies" },
        { name: "Kodubale 180gm", alias: "Kodubale 180g" },
        { name: "Panner Nippatto 400gm", alias: "P.Nippatto 400g" },
      ];

      const pages: React.ReactNode[] = [];

      talukas.forEach((taluka, ti) => {
        const talukaRoutes = routes.filter(r => r.taluka === taluka);
        const talukaCustomers = customers.filter(c => talukaRoutes.some(r => r.id === c.routeId) && c.status === "Active");

        // Page 1: Products breakdown
        let gt1 = 0;
        pages.push(
          <div key={`t1-${taluka}`}>
            <ReportHeader title="Taluka/Agent Wise Sales" subtitle={`Period: ${from} to ${to}`} />
            <p className="text-xs font-bold mb-2">Taluka Name: {taluka}</p>
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border bg-muted/30">
                  <th className="border py-1.5 px-1 text-left font-bold">S.No.</th>
                  <th className="border py-1.5 px-1 text-left font-bold">Code</th>
                  <th className="border py-1.5 px-1 text-left font-bold">Customer Name</th>
                  {activeProducts.map(p => (
                    <th key={p.id} className="border py-1.5 px-1 text-center font-bold whitespace-nowrap">{p.reportAlias}</th>
                  ))}
                  <th className="border py-1.5 px-1 text-right font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {talukaCustomers.map((c, ci) => {
                  let rowTotal = 0;
                  return (
                    <tr key={c.id} className="border">
                      <td className="border py-1 px-1">{ci + 1}</td>
                      <td className="border py-1 px-1 font-mono font-medium">{c.code}</td>
                      <td className="border py-1 px-1 font-medium">{c.name}</td>
                      {activeProducts.map((p, pi) => {
                        const qty = mockQty(ti * 200 + ci * 20 + pi, 80);
                        const amt = qty * (p.rateCategories[c.rateCategory] || p.mrp);
                        rowTotal += amt;
                        return <td key={p.id} className="border py-1 px-1 text-center">{qty}</td>;
                      })}
                      {(() => { gt1 += rowTotal; return null; })()}
                      <td className="border py-1 px-1 text-right font-bold">₹{rowTotal.toLocaleString()}</td>
                    </tr>
                  );
                })}
                <tr className="border font-bold bg-muted/30">
                  <td className="border py-1.5 px-1" colSpan={3}>TOTAL</td>
                  {activeProducts.map(p => <td key={p.id} className="border py-1.5 px-1 text-center">-</td>)}
                  <td className="border py-1.5 px-1 text-right">₹{gt1.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

        // Page 2: Special products + milk/curd totals
        let gt2 = 0;
        pages.push(
          <div key={`t2-${taluka}`}>
            <ReportHeader title="Taluka/Agent Wise Sales — Summary" subtitle={`Period: ${from} to ${to}`} />
            <p className="text-xs font-bold mb-2">Taluka Name: {taluka}</p>
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border bg-muted/30">
                  <th className="border py-1.5 px-1 text-left font-bold">S.No.</th>
                  <th className="border py-1.5 px-1 text-left font-bold">Code</th>
                  <th className="border py-1.5 px-1 text-left font-bold">Customer Name</th>
                  {specialProducts.map(sp => (
                    <th key={sp.alias} className="border py-1.5 px-1 text-center font-bold whitespace-nowrap">{sp.alias}</th>
                  ))}
                  <th className="border py-1.5 px-1 text-center font-bold">Milk Total Qty</th>
                  <th className="border py-1.5 px-1 text-center font-bold">Curd Total Qty</th>
                  <th className="border py-1.5 px-1 text-right font-bold">Total Amt (₹)</th>
                </tr>
              </thead>
              <tbody>
                {talukaCustomers.map((c, ci) => {
                  const milkQty = mockQty(ti * 300 + ci * 5, 200);
                  const curdQty = mockQty(ti * 400 + ci * 7, 80);
                  const totalAmt = mockQty(ti * 500 + ci * 11, 10000) + 2000;
                  gt2 += totalAmt;
                  return (
                    <tr key={c.id} className="border">
                      <td className="border py-1 px-1">{ci + 1}</td>
                      <td className="border py-1 px-1 font-mono font-medium">{c.code}</td>
                      <td className="border py-1 px-1 font-medium">{c.name}</td>
                      {specialProducts.map((sp, spi) => (
                        <td key={sp.alias} className="border py-1 px-1 text-center">{mockQty(ti * 600 + ci * 3 + spi, 30)}</td>
                      ))}
                      <td className="border py-1 px-1 text-center font-medium">{milkQty}</td>
                      <td className="border py-1 px-1 text-center font-medium">{curdQty}</td>
                      <td className="border py-1 px-1 text-right font-bold">₹{totalAmt.toLocaleString()}</td>
                    </tr>
                  );
                })}
                <tr className="border font-bold bg-muted/30">
                  <td className="border py-1.5 px-1" colSpan={3}>TOTAL</td>
                  {specialProducts.map(sp => <td key={sp.alias} className="border py-1.5 px-1 text-center">-</td>)}
                  <td className="border py-1.5 px-1 text-center">-</td>
                  <td className="border py-1.5 px-1 text-center">-</td>
                  <td className="border py-1.5 px-1 text-right">₹{gt2.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      });

      return pages;
    }}
  />
);

// =============================================
// 8. Adhoc Sales Abstract
// Columns: S.No., Indent Date, GP No., Customer Name, Amount
// =============================================
export const AdhocSalesReport = () => (
  <SalesReportShell title="Adhoc Sales Abstract" description="Emergency/ad-hoc sales summary" reportTitle="Adhoc Sales Abstract"
    renderPages={(from, to) => {
      const mockAdhoc = [
        { sno: 1, date: "2026-04-07", gpNo: "GP-001", customer: "Agent Ravi", amount: 1295 },
        { sno: 2, date: "2026-04-07", gpNo: "GP-002", customer: "Agent Kumar", amount: 1580 },
        { sno: 3, date: "2026-04-08", gpNo: "GP-003", customer: "Agent Prakash", amount: 675 },
        { sno: 4, date: "2026-04-08", gpNo: "GP-004", customer: "Cash Customer - Walk-in", amount: 864 },
        { sno: 5, date: "2026-04-08", gpNo: "GP-005", customer: "Agent Ravi", amount: 2340 },
      ];
      const total = mockAdhoc.reduce((s, r) => s + r.amount, 0);

      const page = (
        <div key="p1">
          <ReportHeader title="Adhoc Sales Abstract" subtitle={`Period: ${from} to ${to}`} />
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="border bg-muted/30">
                <th className="border py-1.5 px-2 text-left font-bold">S.No.</th>
                <th className="border py-1.5 px-2 text-left font-bold">Indent Date</th>
                <th className="border py-1.5 px-2 text-left font-bold">GP No.</th>
                <th className="border py-1.5 px-2 text-left font-bold">Customer Name</th>
                <th className="border py-1.5 px-2 text-right font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {mockAdhoc.map(r => (
                <tr key={r.sno} className="border">
                  <td className="border py-1 px-2">{r.sno}</td>
                  <td className="border py-1 px-2">{r.date}</td>
                  <td className="border py-1 px-2 font-mono">{r.gpNo}</td>
                  <td className="border py-1 px-2 font-medium">{r.customer}</td>
                  <td className="border py-1 px-2 text-right">₹{r.amount.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="border font-bold bg-muted/30">
                <td className="border py-1.5 px-2" colSpan={4}>TOTAL</td>
                <td className="border py-1.5 px-2 text-right">₹{total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      return [page];
    }}
  />
);

// =============================================
// 9. GST Sales Statement (unchanged structure, kept as-is)
// =============================================
export const GSTStatement = () => (
  <SalesReportShell title="GST Sales Statement" description="GST-compliant sales with tax breakdowns" reportTitle="GST Sales Statement"
    renderPages={(from, to) => {
      let totalTaxable = 0, totalCgst = 0, totalSgst = 0, totalTax = 0, totalInvoice = 0;

      const page = (
        <div key="p1">
          <ReportHeader title="GST Sales Statement" subtitle={`Period: ${from} to ${to}`} />
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="border bg-muted/30">
                <th className="border py-1.5 px-1 text-left font-bold">Product</th>
                <th className="border py-1.5 px-1 text-left font-bold">HSN</th>
                <th className="border py-1.5 px-1 text-right font-bold">Qty</th>
                <th className="border py-1.5 px-1 text-right font-bold">GST%</th>
                <th className="border py-1.5 px-1 text-right font-bold">Taxable Value</th>
                <th className="border py-1.5 px-1 text-right font-bold">CGST</th>
                <th className="border py-1.5 px-1 text-right font-bold">SGST</th>
                <th className="border py-1.5 px-1 text-right font-bold">Total Tax</th>
                <th className="border py-1.5 px-1 text-right font-bold">Invoice Value</th>
              </tr>
            </thead>
            <tbody>
              {activeProducts.map((p, pi) => {
                const qty = mockQty(pi * 37, 300) + 50;
                const rate = p.rateCategories["Retail-Dealer"] || p.mrp;
                const taxable = qty * rate / (1 + p.gstPercent / 100);
                const cgst = taxable * (p.cgst / 100);
                const sgst = taxable * (p.sgst / 100);
                const tax = cgst + sgst;
                const invoice = taxable + tax;
                totalTaxable += taxable;
                totalCgst += cgst;
                totalSgst += sgst;
                totalTax += tax;
                totalInvoice += invoice;
                return (
                  <tr key={p.id} className="border">
                    <td className="border py-1 px-1 font-medium">{p.reportAlias}</td>
                    <td className="border py-1 px-1">{p.hsnNo}</td>
                    <td className="border py-1 px-1 text-right">{qty}</td>
                    <td className="border py-1 px-1 text-right">{p.gstPercent}%</td>
                    <td className="border py-1 px-1 text-right">₹{taxable.toFixed(2)}</td>
                    <td className="border py-1 px-1 text-right">₹{cgst.toFixed(2)}</td>
                    <td className="border py-1 px-1 text-right">₹{sgst.toFixed(2)}</td>
                    <td className="border py-1 px-1 text-right">₹{tax.toFixed(2)}</td>
                    <td className="border py-1 px-1 text-right font-bold">₹{invoice.toFixed(2)}</td>
                  </tr>
                );
              })}
              <tr className="border font-bold bg-muted/30">
                <td className="border py-1.5 px-1" colSpan={4}>TOTAL</td>
                <td className="border py-1.5 px-1 text-right">₹{totalTaxable.toFixed(2)}</td>
                <td className="border py-1.5 px-1 text-right">₹{totalCgst.toFixed(2)}</td>
                <td className="border py-1.5 px-1 text-right">₹{totalSgst.toFixed(2)}</td>
                <td className="border py-1.5 px-1 text-right">₹{totalTax.toFixed(2)}</td>
                <td className="border py-1.5 px-1 text-right">₹{totalInvoice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      return [page];
    }}
  />
);
