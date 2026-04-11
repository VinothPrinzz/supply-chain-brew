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
import { Switch } from "@/components/ui/switch";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { fetchProducts, createProduct, getRateCategories } from "@/services/api";
import { productSchema, type ProductFormData } from "@/lib/validations";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/data/mockData";

interface Props { tab?: "list" | "add" | "rates"; }

const ProductsPage = ({ tab = "list" }: Props) => {
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const rateCategories = getRateCategories();

  const columns = useMemo<ColumnDef<Product>[]>(() => [
    { accessorKey: "code", header: "Code", cell: ({ row }) => <span className="font-mono">{row.original.code}</span> },
    { accessorKey: "name", header: "Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "category", header: "Category" },
    { id: "pack", header: "Pack", cell: ({ row }) => `${row.original.packSize}${row.original.unit}` },
    { accessorKey: "stock", header: "Stock", cell: ({ row }) => <span className="font-mono">{row.original.stock}</span> },
    { accessorKey: "mrp", header: "MRP", cell: ({ row }) => `₹${row.original.mrp}` },
    { accessorKey: "gstPercent", header: "GST%", cell: ({ row }) => `${row.original.gstPercent}%` },
    { accessorKey: "hsnNo", header: "HSN", cell: ({ row }) => <span className="font-mono">{row.original.hsnNo}</span> },
    { accessorKey: "sortPosition", header: "Sort#" },
    { accessorKey: "printDirection", header: "Direction", cell: ({ row }) => (
      <span className={`text-xs px-1.5 py-0.5 rounded ${row.original.printDirection === "Across" ? "bg-primary/10 text-primary" : "bg-secondary"}`}>{row.original.printDirection}</span>
    )},
  ], []);

  if (tab === "add") return <AddProductForm />;

  if (tab === "rates") {
    const activeProducts = products.filter(p => !p.terminated);
    const rateColumns: ColumnDef<Product>[] = [
      { accessorKey: "name", header: "Product", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
      { accessorKey: "mrp", header: "MRP", cell: ({ row }) => <span className="font-mono">₹{row.original.mrp}</span> },
      ...rateCategories.map(rc => ({
        id: rc,
        header: rc,
        cell: ({ row }: any) => <span className="font-mono">₹{row.original.rateCategories[rc] || "-"}</span>,
      })),
    ];
    return (
      <div>
        <PageHeader title="Rate Categories" description="View and manage product rates by category" />
        <Card><CardContent className="pt-6">
          <DataTable columns={rateColumns} data={activeProducts} searchPlaceholder="Search products..." />
        </CardContent></Card>
      </div>
    );
  }

  if (isLoading) return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;

  return (
    <div>
      <PageHeader title="All Products" description="View all products and packets" />
      <Card><CardContent className="pt-6">
        <DataTable columns={columns} data={products} searchPlaceholder="Search products..." />
      </CardContent></Card>
    </div>
  );
};

function AddProductForm() {
  const qc = useQueryClient();
  const form = useForm<ProductFormData>({ resolver: zodResolver(productSchema), defaultValues: { subsidy: false, indentInBox: false, makeZero: false, terminated: false, printDirection: "Across" } });
  const mutation = useMutation({
    mutationFn: (data: ProductFormData) => createProduct(data),
    onSuccess: () => { toast.success("Product saved successfully"); qc.invalidateQueries({ queryKey: ["products"] }); form.reset(); },
  });

  return (
    <div>
      <PageHeader title="Add Packet" description="Add a new product/packet" />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(data => mutation.mutate(data))}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Packet Name</FormLabel><FormControl><Input placeholder="Product name" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="reportAlias" render={({ field }) => (
                  <FormItem><FormLabel>Report Alias</FormLabel><FormControl><Input placeholder="Short name" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel><FormControl>
                    <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{["Milk", "Curd", "Buttermilk", "Lassi", "Ghee", "Sweets", "Paneer", "Other"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="packSize" render={({ field }) => (
                  <FormItem><FormLabel>Pack Size</FormLabel><FormControl><Input type="number" step="0.01" placeholder="0.5" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="unit" render={({ field }) => (
                  <FormItem><FormLabel>Unit</FormLabel><FormControl>
                    <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="ltr">ltr</SelectItem><SelectItem value="pcs">pcs</SelectItem></SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="mrp" render={({ field }) => (
                  <FormItem><FormLabel>MRP (₹)</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="gstPercent" render={({ field }) => (
                  <FormItem><FormLabel>GST %</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="cgst" render={({ field }) => (
                  <FormItem><FormLabel>CGST</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sgst" render={({ field }) => (
                  <FormItem><FormLabel>SGST</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="hsnNo" render={({ field }) => (
                  <FormItem><FormLabel>HSN No.</FormLabel><FormControl><Input placeholder="HSN" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sortPosition" render={({ field }) => (
                  <FormItem><FormLabel>Sort Position</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="packetsPerCrate" render={({ field }) => (
                  <FormItem><FormLabel>Packets/Crate</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="printDirection" render={({ field }) => (
                  <FormItem><FormLabel>Print Direction</FormLabel><FormControl>
                    <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Across">Across</SelectItem><SelectItem value="Down">Down</SelectItem></SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="subsidy" render={({ field }) => (
                  <FormItem className="flex items-center gap-2 pt-5"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Subsidy</FormLabel></FormItem>
                )} />
                <FormField control={form.control} name="makeZero" render={({ field }) => (
                  <FormItem className="flex items-center gap-2 pt-5"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Make Zero</FormLabel></FormItem>
                )} />
                <FormField control={form.control} name="terminated" render={({ field }) => (
                  <FormItem className="flex items-center gap-2 pt-5"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Terminated</FormLabel></FormItem>
                )} />
              </div>
              <div className="mt-6">
                <Button type="submit" disabled={mutation.isPending}>
                  <Plus className="h-4 w-4 mr-1" /> {mutation.isPending ? "Saving..." : "Save Product"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductsPage;
