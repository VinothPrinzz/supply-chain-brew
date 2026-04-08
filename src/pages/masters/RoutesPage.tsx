import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { routes } from "@/data/mockData";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const RoutesPage = () => (
  <div>
    <PageHeader title="Routes" description="Manage delivery routes" />
    <Tabs defaultValue="list">
      <TabsList className="mb-4">
        <TabsTrigger value="list">Route List</TabsTrigger>
        <TabsTrigger value="new">New Route</TabsTrigger>
      </TabsList>
      <TabsContent value="list">
        <Card>
          <CardHeader><CardTitle className="text-base">All Routes</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead><tr className="border-b">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Code</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Description</th>
              </tr></thead>
              <tbody>
                {routes.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 px-3 font-mono">{r.code}</td>
                    <td className="py-2 px-3 font-medium">{r.name}</td>
                    <td className="py-2 px-3 text-muted-foreground">{r.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="new">
        <Card>
          <CardHeader><CardTitle className="text-base">New Route</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
              <div><Label>Route Code</Label><Input placeholder="e.g. RT07" /></div>
              <div><Label>Route Name</Label><Input placeholder="Route name" /></div>
              <div className="md:col-span-2"><Label>Description</Label><Input placeholder="Description" /></div>
            </div>
            <div className="mt-6"><Button onClick={() => toast.success("Route saved (mock)")}><Plus className="h-4 w-4 mr-1" /> Save</Button></div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);

export default RoutesPage;
