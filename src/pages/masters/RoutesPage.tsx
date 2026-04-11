import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { fetchRoutes, fetchContractors, fetchCustomers, createRoute } from "@/services/api";
import { routeSchema, type RouteFormData } from "@/lib/validations";
import { Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { Route as RouteType } from "@/data/mockData";

interface Props { tab?: "list" | "new"; }

const RoutesPage = ({ tab = "list" }: Props) => {
  const { data: routes = [], isLoading } = useQuery({ queryKey: ["routes"], queryFn: fetchRoutes });
  const { data: contractors = [] } = useQuery({ queryKey: ["contractors"], queryFn: fetchContractors });
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });

  const columns = useMemo<ColumnDef<RouteType>[]>(() => [
    { accessorKey: "code", header: "Code", cell: ({ row }) => <span className="font-mono">{row.original.code}</span> },
    { accessorKey: "name", header: "Route Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "taluka", header: "Taluka" },
    { id: "contractor", header: "Contractor", cell: ({ row }) => contractors.find(ct => ct.id === row.original.contractorId)?.name || "-" },
    { id: "customers", header: "Customers", cell: ({ row }) => <span className="font-mono">{customers.filter(c => c.routeId === row.original.id).length}</span> },
    { accessorKey: "dispatchTime", header: "Dispatch Time" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => (
      <span className={`text-xs px-2 py-0.5 rounded ${row.original.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{row.original.status}</span>
    )},
    { id: "actions", header: "Edit", enableSorting: false, cell: () => <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button> },
  ], [contractors, customers]);

  if (tab === "new") return <NewRouteForm contractors={contractors} />;
  if (isLoading) return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;

  return (
    <div>
      <PageHeader title="All Routes" description="View and manage delivery routes" />
      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={routes} searchPlaceholder="Search routes..." />
        </CardContent>
      </Card>
    </div>
  );
};

function NewRouteForm({ contractors }: { contractors: any[] }) {
  const qc = useQueryClient();
  const form = useForm<RouteFormData>({ resolver: zodResolver(routeSchema) });
  const mutation = useMutation({
    mutationFn: (data: RouteFormData) => createRoute(data),
    onSuccess: () => { toast.success("Route saved successfully"); qc.invalidateQueries({ queryKey: ["routes"] }); form.reset(); },
  });

  return (
    <div>
      <PageHeader title="New Route" description="Add a new delivery route" />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(data => mutation.mutate(data))}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                <FormField control={form.control} name="code" render={({ field }) => (
                  <FormItem><FormLabel>Route Code</FormLabel><FormControl><Input placeholder="e.g. RT07" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Route Name</FormLabel><FormControl><Input placeholder="Route name" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="taluka" render={({ field }) => (
                  <FormItem><FormLabel>Taluka</FormLabel><FormControl><Input placeholder="Taluka name" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="contractorId" render={({ field }) => (
                  <FormItem><FormLabel>Contractor</FormLabel><FormControl>
                    <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select contractor" /></SelectTrigger>
                      <SelectContent>{contractors.map(ct => <SelectItem key={ct.id} value={ct.id}>{ct.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="dispatchTime" render={({ field }) => (
                  <FormItem><FormLabel>Dispatch Time</FormLabel><FormControl><Input placeholder="e.g. 5:30 AM" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem className="md:col-span-2"><FormLabel>Description</FormLabel><FormControl><Input placeholder="Description" {...field} /></FormControl><FormMessage /></FormItem>
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

export default RoutesPage;
