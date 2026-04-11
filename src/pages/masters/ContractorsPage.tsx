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
import { Switch } from "@/components/ui/switch";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { fetchContractors, fetchRoutes, createContractor } from "@/services/api";
import { contractorSchema, type ContractorFormData } from "@/lib/validations";
import { Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { Contractor, Route as RouteType } from "@/data/mockData";

interface Props { tab?: "list" | "new"; }

const ContractorsPage = ({ tab = "list" }: Props) => {
  const qc = useQueryClient();
  const { data: contractors = [], isLoading } = useQuery({ queryKey: ["contractors"], queryFn: fetchContractors });
  const { data: routes = [] } = useQuery({ queryKey: ["routes"], queryFn: fetchRoutes });

  const columns = useMemo<ColumnDef<Contractor>[]>(() => [
    { accessorKey: "name", header: "Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "contact", header: "Contact" },
    { accessorKey: "vehicleNo", header: "Vehicle No.", cell: ({ row }) => <span className="font-mono text-xs">{row.original.vehicleNo}</span> },
    { accessorKey: "address", header: "Address", cell: ({ row }) => <span className="text-muted-foreground">{row.original.address}</span> },
    { id: "routes", header: "Assigned Routes", enableSorting: false, cell: ({ row }) => {
      const assigned = routes.filter(r => row.original.assignedRouteIds.includes(r.id));
      return (
        <div className="flex flex-wrap gap-1">
          {assigned.map(r => <span key={r.id} className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">{r.name}</span>)}
        </div>
      );
    }},
    { accessorKey: "status", header: "Status", cell: ({ row }) => (
      <span className={`text-xs px-2 py-0.5 rounded ${row.original.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{row.original.status}</span>
    )},
    { id: "actions", header: "Actions", enableSorting: false, cell: () => <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button> },
  ], [routes]);

  if (tab === "new") {
    return <NewContractorForm />;
  }

  if (isLoading) return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;

  return (
    <div>
      <PageHeader title="All Contractors" description="View and manage contractors" />
      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={contractors} searchPlaceholder="Search contractors..." />
        </CardContent>
      </Card>
    </div>
  );
};

function NewContractorForm() {
  const qc = useQueryClient();
  const form = useForm<ContractorFormData>({ resolver: zodResolver(contractorSchema), defaultValues: { status: "Active" } });
  const mutation = useMutation({
    mutationFn: (data: ContractorFormData) => createContractor(data),
    onSuccess: () => { toast.success("Contractor saved successfully"); qc.invalidateQueries({ queryKey: ["contractors"] }); form.reset(); },
    onError: () => toast.error("Failed to save contractor"),
  });

  return (
    <div>
      <PageHeader title="New Contractor" description="Add a new contractor" />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(data => mutation.mutate(data))}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Contractor Name</FormLabel><FormControl><Input placeholder="Name" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="contact" render={({ field }) => (
                  <FormItem><FormLabel>Contact</FormLabel><FormControl><Input placeholder="Phone" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="vehicleNo" render={({ field }) => (
                  <FormItem><FormLabel>Vehicle No.</FormLabel><FormControl><Input placeholder="KA-XX-XX-XXXX" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input placeholder="Address" {...field} /></FormControl><FormMessage /></FormItem>
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

export default ContractorsPage;
