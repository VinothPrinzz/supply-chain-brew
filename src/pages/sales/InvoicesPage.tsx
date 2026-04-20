import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { fetchInvoices, fetchCustomers, fetchRoutes } from "@/services/api";
import type { Invoice } from "@/data/mockData";
import { Eye } from "lucide-react";

const InvoicesPage = () => {
  const { data: invoices = [] } = useQuery({ queryKey: ["invoices"], queryFn: fetchInvoices });
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: routes = [] } = useQuery({ queryKey: ["routes"], queryFn: fetchRoutes });

  const columns = useMemo<ColumnDef<Invoice>[]>(() => [
    { accessorKey: "id", header: "Invoice No.", cell: ({ row }) => <span className="font-mono font-medium">{row.original.id}</span> },
    { accessorKey: "date", header: "Date" },
    { id: "customer", header: "Customer", cell: ({ row }) => customers.find(c => c.id === row.original.customerId)?.name || row.original.customerId },
    { id: "route", header: "Route", cell: ({ row }) => routes.find(r => r.id === row.original.routeId)?.name || row.original.routeId },
    { id: "items", header: "Items", cell: ({ row }) => <span className="font-mono">{row.original.lines.length}</span> },
    { accessorKey: "subtotal", header: "Subtotal", cell: ({ row }) => <span className="font-mono">₹{row.original.subtotal.toLocaleString()}</span> },
    { id: "gst", header: "GST", cell: ({ row }) => <span className="font-mono">₹{(row.original.cgst + row.original.sgst).toFixed(2)}</span> },
    { accessorKey: "total", header: "Total", cell: ({ row }) => <span className="font-mono font-semibold">₹{row.original.total.toLocaleString()}</span> },
    { accessorKey: "payMode", header: "Mode" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => {
      const s = row.original.status;
      const cls = s === "Paid" ? "bg-success/10 text-success" : s === "Partial" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive";
      return <span className={`text-xs px-2 py-0.5 rounded ${cls}`}>{s}</span>;
    }},
    { id: "view", header: "", cell: ({ row }) => (
      <Button asChild size="sm" variant="ghost">
        <Link to={`/sales/invoices/${row.original.id}`}><Eye className="h-3.5 w-3.5" /></Link>
      </Button>
    )},
  ], [customers, routes]);

  return (
    <div>
      <PageHeader title="Invoices" description="All sales invoices generated from posted indents" />
      <Card><CardContent className="pt-6">
        <DataTable columns={columns} data={invoices} searchPlaceholder="Search invoice no. or customer..." />
      </CardContent></Card>
    </div>
  );
};

export default InvoicesPage;
