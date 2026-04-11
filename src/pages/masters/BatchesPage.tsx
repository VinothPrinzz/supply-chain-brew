import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { fetchBatches, fetchRoutes, createBatch } from "@/services/api";
import { batchSchema, type BatchFormData } from "@/lib/validations";
import { Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { Route as RouteType } from "@/data/mockData";

const batchTimings: Record<string, string> = {
  Morning: "5:00 AM - 8:00 AM",
  Afternoon: "12:00 PM - 2:00 PM",
  Evening: "4:00 PM - 6:00 PM",
  Night: "8:00 PM - 10:00 PM",
};

interface Props { tab?: "list" | "new"; }

const BatchesPage = ({ tab = "list" }: Props) => {
  const { data: batches = [], isLoading } = useQuery({ queryKey: ["batches"], queryFn: fetchBatches });
  const { data: routes = [] } = useQuery({ queryKey: ["routes"], queryFn: fetchRoutes });

  const routeColumns = useMemo<ColumnDef<RouteType>[]>(() => [
    { accessorKey: "code", header: "Code", cell: ({ row }) => <span className="font-mono">{row.original.code}</span> },
    { accessorKey: "name", header: "Route Name" },
    { accessorKey: "dispatchTime", header: "Dispatch Time" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => (
      <span className={`text-xs px-2 py-0.5 rounded ${row.original.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{row.original.status}</span>
    )},
  ], []);

  if (tab === "new") return <NewBatchForm />;
  if (isLoading) return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;

  return (
    <div>
      <PageHeader title="All Batches" description="Distribution batch timings and assigned routes" />
      {batches.map(b => {
        const batchRoutes = routes.filter(r => b.routeIds.includes(r.id));
        return (
          <Card key={b.id} className="mb-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{b.name} <span className="text-xs font-mono text-muted-foreground ml-2">{b.code}</span></CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">{b.whichBatch} — {b.timing}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${b.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{b.status}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-medium text-muted-foreground mb-2">Routes in this batch:</p>
              <DataTable columns={routeColumns} data={batchRoutes} showSearch={false} showPagination={false} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

function NewBatchForm() {
  const qc = useQueryClient();
  const form = useForm<BatchFormData>({ resolver: zodResolver(batchSchema) });
  const mutation = useMutation({
    mutationFn: (data: BatchFormData) => createBatch(data),
    onSuccess: () => { toast.success("Batch saved successfully"); qc.invalidateQueries({ queryKey: ["batches"] }); form.reset(); },
  });

  const whichBatch = form.watch("whichBatch");

  return (
    <div>
      <PageHeader title="New Batch" description="Add a new distribution batch" />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(data => mutation.mutate(data))}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl">
                <FormField control={form.control} name="code" render={({ field }) => (
                  <FormItem><FormLabel>Batch Code</FormLabel><FormControl><Input placeholder="e.g. BT04" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="whichBatch" render={({ field }) => (
                  <FormItem><FormLabel>Which Batch</FormLabel><FormControl>
                    <Select onValueChange={(val) => { field.onChange(val); form.setValue("timing", batchTimings[val] || ""); }} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                      <SelectContent>{Object.keys(batchTimings).map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="timing" render={({ field }) => (
                  <FormItem><FormLabel>Timing</FormLabel><FormControl><Input {...field} readOnly placeholder="Auto-generated" className="bg-muted/30" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="mt-6">
                <Button type="submit" disabled={mutation.isPending}>
                  <Plus className="h-4 w-4 mr-1" /> {mutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default BatchesPage;
