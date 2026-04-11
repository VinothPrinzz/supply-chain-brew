import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { fetchCustomers, fetchRoutes, createCustomer, removeCustomerFromRoute, getRateCategories, getOfficers } from "@/services/api";
import { customerSchema, type CustomerFormData } from "@/lib/validations";
import { Plus, Eye, Edit } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Customer, Route as RouteType } from "@/data/mockData";

interface Props { tab?: "list" | "new" | "assign-route"; }

const CustomersPage = ({ tab = "list" }: Props) => {
  const qc = useQueryClient();
  const { data: customers = [], isLoading: loadingCustomers } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: routes = [], isLoading: loadingRoutes } = useQuery({ queryKey: ["routes"], queryFn: fetchRoutes });

  const rateCategories = getRateCategories();
  const officers = getOfficers();

  const columns = useMemo<ColumnDef<Customer>[]>(() => [
    { accessorKey: "code", header: "Code", cell: ({ row }) => <span className="font-mono">{row.original.code}</span> },
    { accessorKey: "name", header: "Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "type", header: "Type", cell: ({ row }) => <span className="text-xs px-2 py-0.5 rounded bg-secondary">{row.original.type}</span> },
    { accessorKey: "routeId", header: "Route", cell: ({ row }) => routes.find(r => r.id === row.original.routeId)?.name || "-" },
    { accessorKey: "payMode", header: "Pay Mode" },
    { accessorKey: "creditBalance", header: "Credit Balance", cell: ({ row }) => <span className="font-mono">₹{row.original.creditBalance.toLocaleString()}</span> },
    { accessorKey: "status", header: "Status", cell: ({ row }) => (
      <span className={`text-xs px-2 py-0.5 rounded ${row.original.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{row.original.status}</span>
    )},
    { id: "actions", header: "Actions", enableSorting: false, cell: () => (
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
      </div>
    )},
  ], [routes]);

  // NEW CUSTOMER FORM
  if (tab === "new") {
    return <NewCustomerForm rateCategories={rateCategories} officers={officers} />;
  }

  // ASSIGN ROUTE
  if (tab === "assign-route") {
    return <AssignRouteView routes={routes} customers={customers} loading={loadingCustomers || loadingRoutes} />;
  }

  if (loadingCustomers) return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;

  return (
    <div>
      <PageHeader title="All Customers" description="View and manage all customers" />
      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={customers} searchPlaceholder="Search customers..." pageSize={25} />
        </CardContent>
      </Card>
    </div>
  );
};

function NewCustomerForm({ rateCategories, officers }: { rateCategories: string[]; officers: string[] }) {
  const qc = useQueryClient();
  const form = useForm<CustomerFormData>({ resolver: zodResolver(customerSchema), defaultValues: { status: "Active", payMode: "Cash" } });
  const mutation = useMutation({
    mutationFn: (data: CustomerFormData) => createCustomer(data),
    onSuccess: () => { toast.success("Customer saved successfully"); qc.invalidateQueries({ queryKey: ["customers"] }); form.reset(); },
    onError: () => toast.error("Failed to save customer"),
  });

  return (
    <div>
      <PageHeader title="New Customer" description="Add a new customer" />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Customer Name</FormLabel><FormControl><Input placeholder="Enter customer name" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem><FormLabel>Customer Type</FormLabel><FormControl>
                    <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Retail-Dealer">Retail-Dealer</SelectItem>
                        <SelectItem value="Credit Inst-MRP">Credit Institution-MRP</SelectItem>
                        <SelectItem value="Credit Inst-Dealer">Credit Institution-Dealer</SelectItem>
                        <SelectItem value="Parlour-Dealer">Parlour-Dealer</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="rateCategory" render={({ field }) => (
                  <FormItem><FormLabel>Rate Category</FormLabel><FormControl>
                    <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select rate" /></SelectTrigger>
                      <SelectContent>{rateCategories.map(rc => <SelectItem key={rc} value={rc}>{rc}</SelectItem>)}</SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="bank" render={({ field }) => (
                  <FormItem><FormLabel>Bank</FormLabel><FormControl><Input placeholder="Bank name" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="payMode" render={({ field }) => (
                  <FormItem><FormLabel>Pay Mode</FormLabel><FormControl>
                    <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Cash">Cash</SelectItem><SelectItem value="Credit">Credit</SelectItem></SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="officerName" render={({ field }) => (
                  <FormItem><FormLabel>Officer Name</FormLabel><FormControl>
                    <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select officer" /></SelectTrigger>
                      <SelectContent>{officers.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="Phone number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="City" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input placeholder="Full address" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="mt-6">
                <Button type="submit" disabled={mutation.isPending}>
                  <Plus className="h-4 w-4 mr-1" /> {mutation.isPending ? "Saving..." : "Save Customer"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function AssignRouteView({ routes, customers, loading }: { routes: RouteType[]; customers: Customer[]; loading: boolean }) {
  const qc = useQueryClient();
  const [selectedRoute, setSelectedRoute] = React.useState("");
  const routeCustomers = selectedRoute ? customers.filter(c => c.routeId === selectedRoute && c.status === "Active") : [];

  const removeMutation = useMutation({
    mutationFn: (customerId: string) => removeCustomerFromRoute(customerId),
    onSuccess: () => { toast.success("Customer removed from route"); qc.invalidateQueries({ queryKey: ["customers"] }); },
  });

  const columns = useMemo<ColumnDef<Customer>[]>(() => [
    { accessorKey: "code", header: "Code", cell: ({ row }) => <span className="font-mono">{row.original.code}</span> },
    { accessorKey: "name", header: "Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "type", header: "Type", cell: ({ row }) => <span className="text-xs px-2 py-0.5 rounded bg-secondary">{row.original.type}</span> },
    { accessorKey: "phone", header: "Phone" },
    { id: "actions", header: "Actions", enableSorting: false, cell: ({ row }) => (
      <Button variant="ghost" size="sm" className="text-destructive h-7" onClick={() => removeMutation.mutate(row.original.id)}>Remove</Button>
    )},
  ], [removeMutation]);

  return (
    <div>
      <PageHeader title="Assign Route" description="Assign customers to routes" />
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-3 items-end">
            <div><label className="text-sm font-medium">Select Route</label>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger className="w-64"><SelectValue placeholder="Choose route" /></SelectTrigger>
                <SelectContent>{routes.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      {selectedRoute && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Customers on {routes.find(r => r.id === selectedRoute)?.name}</CardTitle>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Customer</Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={routeCustomers} showSearch={false} showPagination={false} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Need React import for useState in AssignRouteView
import React from "react";

export default CustomersPage;
