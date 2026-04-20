import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReportViewer from "@/components/ReportViewer";
import { fetchCustomers, fetchLedger } from "@/services/api";
import { Printer } from "lucide-react";

const LedgerPage = () => {
  const [customerId, setCustomerId] = useState<string>("");
  const [from, setFrom] = useState<string>("2026-04-01");
  const [to, setTo] = useState<string>("2026-04-30");
  const [printOpen, setPrintOpen] = useState(false);

  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: ledger } = useQuery({
    queryKey: ["ledger", customerId, from, to],
    queryFn: () => fetchLedger(customerId, from, to),
    enabled: !!customerId,
  });

  const customer = customers.find(c => c.id === customerId);

  const summary = useMemo(() => {
    if (!ledger) return { opening: 0, debits: 0, credits: 0, closing: 0 };
    const debits = ledger.rows.reduce((s, r) => s + r.debit, 0);
    const credits = ledger.rows.reduce((s, r) => s + r.credit, 0);
    return { opening: ledger.opening, debits, credits, closing: ledger.closing };
  }, [ledger]);

  const printPage = ledger && customer ? (
    <div className="text-[11px] text-foreground">
      <div className="text-center border-b-2 border-foreground pb-2 mb-3">
        <h1 className="text-base font-bold">HAVERI MILK UNION LTD.</h1>
        <h2 className="text-sm font-semibold mt-1">Statement of Account</h2>
      </div>
      <div className="flex justify-between mb-2 text-[10px]">
        <div>
          <p><b>{customer.name}</b></p>
          <p>{customer.address}, {customer.city}</p>
        </div>
        <div className="text-right">
          <p>Period: {from} to {to}</p>
          <p>Account Code: {customer.code}</p>
        </div>
      </div>
      <table className="w-full border border-foreground text-[10px]">
        <thead className="bg-muted">
          <tr>
            <th className="border border-foreground px-1 py-1">Date</th>
            <th className="border border-foreground px-1 py-1">Type</th>
            <th className="border border-foreground px-1 py-1">Voucher</th>
            <th className="border border-foreground px-1 py-1 text-left">Particulars</th>
            <th className="border border-foreground px-1 py-1 text-right">Debit</th>
            <th className="border border-foreground px-1 py-1 text-right">Credit</th>
            <th className="border border-foreground px-1 py-1 text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          {ledger.rows.map((r, i) => (
            <tr key={i}>
              <td className="border border-foreground px-1 py-1">{r.date}</td>
              <td className="border border-foreground px-1 py-1">{r.voucherType}</td>
              <td className="border border-foreground px-1 py-1 font-mono">{r.voucherNo}</td>
              <td className="border border-foreground px-1 py-1">{r.particulars}</td>
              <td className="border border-foreground px-1 py-1 text-right font-mono">{r.debit ? r.debit.toFixed(2) : ""}</td>
              <td className="border border-foreground px-1 py-1 text-right font-mono">{r.credit ? r.credit.toFixed(2) : ""}</td>
              <td className="border border-foreground px-1 py-1 text-right font-mono">{r.balance.toFixed(2)}</td>
            </tr>
          ))}
          <tr className="bg-muted font-bold">
            <td colSpan={4} className="border border-foreground px-1 py-1 text-right">Closing Balance</td>
            <td className="border border-foreground px-1 py-1 text-right font-mono">{summary.debits.toFixed(2)}</td>
            <td className="border border-foreground px-1 py-1 text-right font-mono">{summary.credits.toFixed(2)}</td>
            <td className="border border-foreground px-1 py-1 text-right font-mono">{ledger.closing.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : null;

  return (
    <div>
      <PageHeader title="Dealer Ledger / Wallet" description="Statement of account for any dealer" />

      <Card className="mb-4">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium">Customer</label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger><SelectValue placeholder="Select dealer" /></SelectTrigger>
              <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium">From</label>
            <Input type="date" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium">To</label>
            <Input type="date" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full" disabled={!customerId} onClick={() => setPrintOpen(o => !o)}>
              <Printer className="h-4 w-4 mr-1" /> {printOpen ? "Hide A4 View" : "Print View"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {!customerId ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">Select a dealer to view their ledger.</CardContent></Card>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            {[
              { label: "Opening", value: summary.opening },
              { label: "Total Debits", value: summary.debits },
              { label: "Total Credits", value: summary.credits },
              { label: "Closing Balance", value: summary.closing },
              { label: "Credit Limit", value: customer?.creditBalance || 0 },
            ].map(s => (
              <Card key={s.label}><CardContent className="p-3">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold font-mono">₹{s.value.toLocaleString()}</p>
              </CardContent></Card>
            ))}
          </div>

          {printOpen && printPage ? (
            <ReportViewer title={`Ledger — ${customer?.name}`} pages={[printPage]} />
          ) : (
            <Card><CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-2 py-2 text-left">Date</th>
                      <th className="px-2 py-2 text-left">Type</th>
                      <th className="px-2 py-2 text-left">Voucher</th>
                      <th className="px-2 py-2 text-left">Particulars</th>
                      <th className="px-2 py-2 text-right">Debit</th>
                      <th className="px-2 py-2 text-right">Credit</th>
                      <th className="px-2 py-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger?.rows.map((r, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-2 py-2">{r.date}</td>
                        <td className="px-2 py-2">{r.voucherType}</td>
                        <td className="px-2 py-2 font-mono text-xs">{r.voucherNo}</td>
                        <td className="px-2 py-2">{r.particulars}</td>
                        <td className="px-2 py-2 text-right font-mono">{r.debit ? `₹${r.debit.toFixed(2)}` : "-"}</td>
                        <td className="px-2 py-2 text-right font-mono">{r.credit ? `₹${r.credit.toFixed(2)}` : "-"}</td>
                        <td className="px-2 py-2 text-right font-mono font-semibold">₹{r.balance.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent></Card>
          )}
        </>
      )}
    </div>
  );
};

export default LedgerPage;
