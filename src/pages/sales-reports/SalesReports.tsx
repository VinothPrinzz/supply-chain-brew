import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import ReportViewer from "@/components/ReportViewer";
import { products } from "@/data/mockData";

// Generic sales report shell — reused for multiple report pages
interface SalesReportShellProps {
  title: string;
  description: string;
  reportTitle: string;
  columns: { label: string; key: string; align?: string }[];
  mockRows: Record<string, string | number | boolean>[];
}

const SalesReportShell: React.FC<SalesReportShellProps> = ({ title, description, reportTitle, columns, mockRows }) => {
  const [fromDate, setFromDate] = useState("2026-04-01");
  const [toDate, setToDate] = useState("2026-04-08");
  const [showReport, setShowReport] = useState(false);

  const page = (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-sm font-bold uppercase">Haveri Milk Union — {reportTitle}</h2>
        <p className="text-xs text-muted-foreground">{fromDate} to {toDate}</p>
      </div>
      <table className="w-full text-xs border-collapse">
        <thead><tr className="border">
          {columns.map((col) => (
            <th key={col.key} className={`border py-1 px-2 font-medium ${col.align === "right" ? "text-right" : "text-left"}`}>{col.label}</th>
          ))}
        </tr></thead>
        <tbody>
          {mockRows.map((row, i) => (
            <tr key={i} className={`border ${row._bold ? "font-semibold bg-muted/20" : ""}`}>
              {columns.map((col) => (
                <td key={col.key} className={`border py-1 px-2 ${col.align === "right" ? "text-right" : ""}`}>{row[col.key] ?? ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
      {showReport && <ReportViewer title={reportTitle} pages={[page]} />}
    </div>
  );
};

// ===== Individual Report Pages =====

export const DailySalesStatement = () => (
  <SalesReportShell
    title="Daily Sales Statement"
    description="DMU items daily sales (own production)"
    reportTitle="Daily Sales Statement — DMU Items"
    columns={[
      { label: "Date", key: "date" },
      { label: "Product", key: "product" },
      { label: "Qty", key: "qty", align: "right" },
      { label: "Rate", key: "rate", align: "right" },
      { label: "Amount", key: "amount", align: "right" },
    ]}
    mockRows={[
      { date: "08-04-2026", product: "TM 500", qty: 250, rate: "₹22.50", amount: "₹5,625" },
      { date: "08-04-2026", product: "FCM 500", qty: 150, rate: "₹28.00", amount: "₹4,200" },
      { date: "08-04-2026", product: "Curd 500", qty: 80, rate: "₹28.00", amount: "₹2,240" },
      { date: "", product: "", qty: "", rate: "TOTAL", amount: "₹12,065", _bold: true },
    ]}
  />
);

export const DayRouteCashSales = () => (
  <SalesReportShell
    title="Day/Route Wise Cash Sales"
    description="Cash sales breakdown by day and route"
    reportTitle="Day/Route Wise Cash Sales"
    columns={[
      { label: "Date", key: "date" },
      { label: "Route", key: "route" },
      { label: "Customers", key: "customers", align: "right" },
      { label: "Qty", key: "qty", align: "right" },
      { label: "Amount", key: "amount", align: "right" },
    ]}
    mockRows={[
      { date: "08-04-2026", route: "Haveri City Route 1", customers: 3, qty: 120, amount: "₹3,240" },
      { date: "08-04-2026", route: "Haveri City Route 2", customers: 2, qty: 85, amount: "₹2,180" },
      { date: "08-04-2026", route: "Ranebennur Route", customers: 1, qty: 60, amount: "₹1,350" },
      { date: "", route: "", customers: "", qty: "", amount: "₹6,770", _bold: true },
    ]}
  />
);

export const OfficerWiseSales = () => (
  <SalesReportShell
    title="Officer Wise Sales (Qty)"
    description="Sales grouped by officer"
    reportTitle="Officer Wise Sales Report"
    columns={[
      { label: "Officer", key: "officer" },
      { label: "TM 500", key: "tm", align: "right" },
      { label: "FCM 500", key: "fcm", align: "right" },
      { label: "Curd 500", key: "curd", align: "right" },
      { label: "Total Qty", key: "total", align: "right" },
    ]}
    mockRows={[
      { officer: "Ramesh K", tm: 120, fcm: 60, curd: 40, total: 220 },
      { officer: "Suresh M", tm: 80, fcm: 50, curd: 30, total: 160 },
      { officer: "Mahesh P", tm: 50, fcm: 40, curd: 10, total: 100 },
      { officer: "TOTAL", tm: 250, fcm: 150, curd: 80, total: 480, _bold: true },
    ]}
  />
);

export const CashSalesReport = () => (
  <SalesReportShell
    title="Cash Sales"
    description="Daily-payment customers' sales"
    reportTitle="Cash Sales Report"
    columns={[
      { label: "Customer", key: "customer" },
      { label: "Route", key: "route" },
      { label: "Qty", key: "qty", align: "right" },
      { label: "Amount", key: "amount", align: "right" },
    ]}
    mockRows={[
      { customer: "Sri Lakshmi Dairy", route: "Haveri City Route 1", qty: 100, amount: "₹2,250" },
      { customer: "Nandini Parlour MG Road", route: "Haveri City Route 2", qty: 30, amount: "₹660" },
      { customer: "Maruthi Stores", route: "Ranebennur Route", qty: 60, amount: "₹1,350" },
      { customer: "TOTAL", route: "", qty: 190, amount: "₹4,260", _bold: true },
    ]}
  />
);

export const CreditSalesReport = () => (
  <SalesReportShell
    title="Credit Sales"
    description="Monthly credit institution sales"
    reportTitle="Credit Sales Report"
    columns={[
      { label: "Institution", key: "institution" },
      { label: "Product", key: "product" },
      { label: "Qty", key: "qty", align: "right" },
      { label: "Rate", key: "rate", align: "right" },
      { label: "Amount", key: "amount", align: "right" },
    ]}
    mockRows={[
      { institution: "Govt. Hospital Haveri", product: "TM 500", qty: 20, rate: "₹24.00", amount: "₹480" },
      { institution: "Govt. Hospital Haveri", product: "Curd 500", qty: 10, rate: "₹30.00", amount: "₹300" },
      { institution: "Hotel Sagar", product: "TM 500", qty: 40, rate: "₹22.50", amount: "₹900" },
      { institution: "TOTAL", product: "", qty: 70, rate: "", amount: "₹1,680", _bold: true },
    ]}
  />
);

export const SalesRegister = () => (
  <SalesReportShell
    title="Sales Register"
    description="Combined cash + credit sales"
    reportTitle="Sales Register"
    columns={[
      { label: "Date", key: "date" },
      { label: "Cash Sales", key: "cash", align: "right" },
      { label: "Credit Sales", key: "credit", align: "right" },
      { label: "Adhoc Sales", key: "adhoc", align: "right" },
      { label: "Total", key: "total", align: "right" },
    ]}
    mockRows={[
      { date: "07-04-2026", cash: "₹5,400", credit: "₹1,200", adhoc: "₹350", total: "₹6,950" },
      { date: "08-04-2026", cash: "₹4,260", credit: "₹1,680", adhoc: "₹870", total: "₹6,810" },
      { date: "TOTAL", cash: "₹9,660", credit: "₹2,880", adhoc: "₹1,220", total: "₹13,760", _bold: true },
    ]}
  />
);

export const TalukaAgentSales = () => (
  <SalesReportShell
    title="Taluka/Agent Wise Sales"
    description="Sales grouped by taluka and agent"
    reportTitle="Taluka/Agent Wise Sales"
    columns={[
      { label: "Taluka", key: "taluka" },
      { label: "Agent", key: "agent" },
      { label: "Route", key: "route" },
      { label: "Qty", key: "qty", align: "right" },
      { label: "Amount", key: "amount", align: "right" },
    ]}
    mockRows={[
      { taluka: "Haveri", agent: "Agent Ravi", route: "Haveri City Route 1", qty: 120, amount: "₹3,240" },
      { taluka: "Haveri", agent: "Agent Kumar", route: "Haveri City Route 2", qty: 85, amount: "₹2,180" },
      { taluka: "Ranebennur", agent: "Agent Prakash", route: "Ranebennur Route", qty: 60, amount: "₹1,350" },
      { taluka: "TOTAL", agent: "", route: "", qty: 265, amount: "₹6,770", _bold: true },
    ]}
  />
);

export const AdhocSalesReport = () => (
  <SalesReportShell
    title="Adhoc Sales Abstract"
    description="Emergency/ad-hoc sales summary"
    reportTitle="Adhoc Sales Abstract"
    columns={[
      { label: "Date", key: "date" },
      { label: "Agent", key: "agent" },
      { label: "Type", key: "type" },
      { label: "Qty", key: "qty", align: "right" },
      { label: "Amount", key: "amount", align: "right" },
    ]}
    mockRows={[
      { date: "08-04-2026", agent: "Agent Ravi", type: "Gate Pass", qty: 20, amount: "₹450" },
      { date: "08-04-2026", agent: "Agent Kumar", type: "Gate Pass", qty: 15, amount: "₹420" },
      { date: "TOTAL", agent: "", type: "", qty: 35, amount: "₹870", _bold: true },
    ]}
  />
);

export const GSTStatement = () => (
  <SalesReportShell
    title="GST Sales Statement"
    description="GST-compliant sales with tax breakdowns"
    reportTitle="GST Sales Statement"
    columns={[
      { label: "Product", key: "product" },
      { label: "HSN", key: "hsn" },
      { label: "Qty", key: "qty", align: "right" },
      { label: "Taxable Value", key: "taxable", align: "right" },
      { label: "CGST", key: "cgst", align: "right" },
      { label: "SGST", key: "sgst", align: "right" },
      { label: "Total", key: "total", align: "right" },
    ]}
    mockRows={[
      { product: "TM 500", hsn: "0401", qty: 250, taxable: "₹5,625", cgst: "₹0", sgst: "₹0", total: "₹5,625" },
      { product: "Curd 500", hsn: "0403", qty: 80, taxable: "₹2,133", cgst: "₹53", sgst: "₹53", total: "₹2,240" },
      { product: "BM 200", hsn: "0403", qty: 150, taxable: "₹1,205", cgst: "₹72", sgst: "₹72", total: "₹1,350" },
      { product: "TOTAL", hsn: "", qty: 480, taxable: "₹8,963", cgst: "₹125", sgst: "₹125", total: "₹9,215", _bold: true },
    ]}
  />
);
