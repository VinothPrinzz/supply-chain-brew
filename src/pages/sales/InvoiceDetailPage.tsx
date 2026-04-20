import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import ReportViewer from "@/components/ReportViewer";
import { Button } from "@/components/ui/button";
import { fetchInvoice, fetchCustomers, fetchRoutes, fetchProducts } from "@/services/api";
import { ArrowLeft } from "lucide-react";

const numToWords = (n: number): string => {
  // Light placeholder; formal "amount in words" lib left out.
  return `Rupees ${Math.round(n).toLocaleString("en-IN")} Only`;
};

const InvoiceDetailPage = () => {
  const { id = "" } = useParams();
  const { data: invoice } = useQuery({ queryKey: ["invoice", id], queryFn: () => fetchInvoice(id), enabled: !!id });
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: routes = [] } = useQuery({ queryKey: ["routes"], queryFn: fetchRoutes });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  if (!invoice) {
    return (
      <div>
        <PageHeader title="Invoice" description="Loading..." />
      </div>
    );
  }
  const customer = customers.find(c => c.id === invoice.customerId);
  const route = routes.find(r => r.id === invoice.routeId);

  const page = (
    <div className="text-[11px] leading-snug text-foreground">
      <div className="text-center border-b-2 border-foreground pb-2 mb-3">
        <h1 className="text-lg font-bold">HAVERI MILK UNION LTD.</h1>
        <p className="text-[10px]">Industrial Estate, Haveri, Karnataka — 581110</p>
        <p className="text-[10px]">GSTIN: 29AABCH1234X1Z5 · Phone: 08375-220011</p>
        <h2 className="text-base font-bold mt-2">TAX INVOICE</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-[10px] text-muted-foreground">Bill To</p>
          <p className="font-bold text-sm">{customer?.name}</p>
          <p>{customer?.address}</p>
          <p>{customer?.city} · Phone: {customer?.phone}</p>
          <p>Route: {route?.name}</p>
        </div>
        <div className="text-right">
          <p><span className="text-muted-foreground">Invoice No: </span><span className="font-bold">{invoice.id}</span></p>
          <p><span className="text-muted-foreground">Date: </span>{invoice.date}</p>
          <p><span className="text-muted-foreground">Pay Mode: </span>{invoice.payMode}</p>
          <p><span className="text-muted-foreground">Status: </span>{invoice.status}</p>
        </div>
      </div>

      <table className="w-full border border-foreground text-[10px]">
        <thead className="bg-muted">
          <tr>
            <th className="border border-foreground px-1 py-1">Sl</th>
            <th className="border border-foreground px-1 py-1 text-left">Product</th>
            <th className="border border-foreground px-1 py-1">HSN</th>
            <th className="border border-foreground px-1 py-1">Qty</th>
            <th className="border border-foreground px-1 py-1">Pack</th>
            <th className="border border-foreground px-1 py-1">Rate</th>
            <th className="border border-foreground px-1 py-1">Basic</th>
            <th className="border border-foreground px-1 py-1">CGST%</th>
            <th className="border border-foreground px-1 py-1">CGST ₹</th>
            <th className="border border-foreground px-1 py-1">SGST%</th>
            <th className="border border-foreground px-1 py-1">SGST ₹</th>
            <th className="border border-foreground px-1 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lines.map((l, idx) => {
            const p = products.find(pp => pp.id === l.productId);
            return (
              <tr key={l.productId}>
                <td className="border border-foreground px-1 py-1 text-center">{idx + 1}</td>
                <td className="border border-foreground px-1 py-1">{p?.name}</td>
                <td className="border border-foreground px-1 py-1 text-center">{p?.hsnNo}</td>
                <td className="border border-foreground px-1 py-1 text-right">{l.qty}</td>
                <td className="border border-foreground px-1 py-1 text-center">{p?.packSize}{p?.unit}</td>
                <td className="border border-foreground px-1 py-1 text-right">{l.rate.toFixed(2)}</td>
                <td className="border border-foreground px-1 py-1 text-right">{l.basic.toFixed(2)}</td>
                <td className="border border-foreground px-1 py-1 text-center">{p?.cgst}%</td>
                <td className="border border-foreground px-1 py-1 text-right">{l.cgstAmt.toFixed(2)}</td>
                <td className="border border-foreground px-1 py-1 text-center">{p?.sgst}%</td>
                <td className="border border-foreground px-1 py-1 text-right">{l.sgstAmt.toFixed(2)}</td>
                <td className="border border-foreground px-1 py-1 text-right font-semibold">{l.total.toFixed(2)}</td>
              </tr>
            );
          })}
          <tr className="bg-muted font-bold">
            <td colSpan={6} className="border border-foreground px-1 py-1 text-right">Totals</td>
            <td className="border border-foreground px-1 py-1 text-right">{invoice.subtotal.toFixed(2)}</td>
            <td className="border border-foreground"></td>
            <td className="border border-foreground px-1 py-1 text-right">{invoice.cgst.toFixed(2)}</td>
            <td className="border border-foreground"></td>
            <td className="border border-foreground px-1 py-1 text-right">{invoice.sgst.toFixed(2)}</td>
            <td className="border border-foreground px-1 py-1 text-right">{invoice.total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-[10px] text-muted-foreground">Amount in Words</p>
          <p className="font-semibold italic">{numToWords(invoice.total)}</p>
        </div>
        <div className="text-right border border-foreground p-2">
          <p>Subtotal: <span className="font-mono">₹{invoice.subtotal.toFixed(2)}</span></p>
          <p>CGST: <span className="font-mono">₹{invoice.cgst.toFixed(2)}</span></p>
          <p>SGST: <span className="font-mono">₹{invoice.sgst.toFixed(2)}</span></p>
          <p className="border-t mt-1 pt-1 font-bold text-sm">Grand Total: ₹{invoice.total.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-12">
        <div>
          <p className="text-[10px]">Customer Signature</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">For HAVERI MILK UNION LTD.</p>
          <p className="text-[10px] mt-8">Authorised Signatory</p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title={`Invoice ${invoice.id}`} description={`${customer?.name} · ${invoice.date}`}>
        <Button asChild variant="outline" size="sm"><Link to="/sales/invoices"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link></Button>
      </PageHeader>
      <ReportViewer title={`Tax Invoice — ${invoice.id}`} pages={[page]} />
    </div>
  );
};

export default InvoiceDetailPage;
