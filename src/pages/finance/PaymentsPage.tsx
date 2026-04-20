import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/DataTable";
import { fetchPayments, fetchInvoices, fetchCustomers, createPayment } from "@/services/api";
import type { Payment } from "@/data/mockData";
import { paymentSchema, type PaymentFormData } from "@/lib/validations";
import { toast } from "sonner";

const PaymentsPage = () => {
  const [tab, setTab] = useState("list");
  const { data: payments = [] } = useQuery({ queryKey: ["payments"], queryFn: fetchPayments });
  const { data: invoices = [] } = useQuery({ queryKey: ["invoices"], queryFn: fetchInvoices });
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });

  const summary = useMemo(() => {
    const total = invoices.reduce((s, i) => s + i.total, 0);
    const paid = invoices.reduce((s, i) => s + i.amountPaid, 0);
    const today = new Date().toISOString().slice(0, 10);
    const todayReceived = payments.filter(p => p.date === today).reduce((s, p) => s + p.amount, 0);
    const outstanding = total - paid;
    const overdue = invoices.filter(i => i.status !== "Paid" && (Date.now() - new Date(i.date).getTime()) > 30 * 86400000)
      .reduce((s, i) => s + (i.total - i.amountPaid), 0);
    return { total, todayReceived, outstanding, overdue };
  }, [invoices, payments]);

  const columns = useMemo<ColumnDef<Payment>[]>(() => [
    { accessorKey: "receiptNo", header: "Receipt", cell: ({ row }) => <span className="font-mono font-medium">{row.original.receiptNo}</span> },
    { accessorKey: "date", header: "Date" },
    { id: "customer", header: "Customer", cell: ({ row }) => customers.find(c => c.id === row.original.customerId)?.name || row.original.customerId },
    { accessorKey: "mode", header: "Mode" },
    { accessorKey: "reference", header: "Reference" },
    { accessorKey: "amount", header: "Amount", cell: ({ row }) => <span className="font-mono font-semibold">₹{row.original.amount.toLocaleString()}</span> },
    { id: "alloc", header: "Allocated To", cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.original.allocations.map(a => a.invoiceId).join(", ")}</span>
    )},
  ], [customers]);

  return (
    <div>
      <PageHeader title="Payments" description="Receipts collected and allocated against invoices" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { label: "Total Receivable", value: `₹${summary.total.toLocaleString()}` },
          { label: "Received Today", value: `₹${summary.todayReceived.toLocaleString()}` },
          { label: "Outstanding", value: `₹${summary.outstanding.toLocaleString()}` },
          { label: "Overdue (>30d)", value: `₹${summary.overdue.toLocaleString()}` },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold font-mono">{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="list">All Payments</TabsTrigger>
          <TabsTrigger value="new">Record Payment</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card><CardContent className="pt-6">
            <DataTable columns={columns} data={payments} searchPlaceholder="Search receipt or reference..." />
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="new">
          <RecordPaymentForm onSaved={() => setTab("list")} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

function RecordPaymentForm({ onSaved }: { onSaved: () => void }) {
  const qc = useQueryClient();
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: invoices = [] } = useQuery({ queryKey: ["invoices"], queryFn: fetchInvoices });
  const [allocs, setAllocs] = useState<Record<string, boolean>>({});

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { customerId: "", date: new Date().toISOString().slice(0, 10), mode: "Cash", reference: "", amount: 0, notes: "" },
  });
  const customerId = form.watch("customerId");
  const amount = form.watch("amount");

  const outstandingInvs = useMemo(() =>
    invoices.filter(i => i.customerId === customerId && i.status !== "Paid").sort((a, b) => a.date.localeCompare(b.date)),
    [invoices, customerId]
  );

  const allocated = useMemo(() => outstandingInvs.filter(i => allocs[i.id]).reduce((s, i) => s + (i.total - i.amountPaid), 0), [outstandingInvs, allocs]);

  const mut = useMutation({
    mutationFn: (d: PaymentFormData) => createPayment({
      ...d,
      allocations: outstandingInvs.filter(i => allocs[i.id]).map(i => ({ invoiceId: i.id, amount: i.total - i.amountPaid })),
    }),
    onSuccess: () => {
      toast.success("Payment recorded");
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
      form.reset(); setAllocs({}); onSaved();
    },
  });

  return (
    <Card><CardHeader><CardTitle className="text-base">New Receipt</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(d => mut.mutate(d))} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium">Customer *</label>
            <Select value={customerId} onValueChange={(v) => { form.setValue("customerId", v); setAllocs({}); }}>
              <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
              <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium">Date *</label>
            <Input type="date" {...form.register("date")} />
          </div>
          <div>
            <label className="text-xs font-medium">Mode *</label>
            <Select value={form.watch("mode")} onValueChange={(v) => form.setValue("mode", v as PaymentFormData["mode"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Cash", "UPI", "Cheque", "Bank"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium">Reference</label>
            <Input {...form.register("reference")} placeholder="Txn / Cheque no." />
          </div>
          <div>
            <label className="text-xs font-medium">Amount *</label>
            <Input type="number" step="0.01" {...form.register("amount")} />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-medium">Notes</label>
            <Textarea rows={2} {...form.register("notes")} />
          </div>

          {customerId && (
            <div className="md:col-span-3 border rounded p-3 bg-muted/20">
              <p className="text-sm font-semibold mb-2">Allocate to Outstanding Invoices</p>
              {outstandingInvs.length === 0 ? (
                <p className="text-xs text-muted-foreground">No outstanding invoices.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-xs text-muted-foreground">
                    <th></th><th>Invoice</th><th>Date</th><th className="text-right">Total</th><th className="text-right">Paid</th><th className="text-right">Due</th>
                  </tr></thead>
                  <tbody>
                    {outstandingInvs.map(i => (
                      <tr key={i.id} className="border-t">
                        <td className="py-1"><Checkbox checked={!!allocs[i.id]} onCheckedChange={(v) => setAllocs(prev => ({ ...prev, [i.id]: !!v }))} /></td>
                        <td className="font-mono">{i.id}</td>
                        <td>{i.date}</td>
                        <td className="text-right font-mono">₹{i.total.toFixed(2)}</td>
                        <td className="text-right font-mono">₹{i.amountPaid.toFixed(2)}</td>
                        <td className="text-right font-mono font-semibold">₹{(i.total - i.amountPaid).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="flex justify-end gap-6 mt-2 text-sm">
                <span>Allocated: <span className="font-mono font-semibold">₹{allocated.toFixed(2)}</span></span>
                <span>Amount: <span className="font-mono font-semibold">₹{Number(amount || 0).toFixed(2)}</span></span>
              </div>
            </div>
          )}

          <div className="md:col-span-3">
            <Button type="submit" disabled={mut.isPending}>{mut.isPending ? "Saving..." : "Record Payment"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default PaymentsPage;
