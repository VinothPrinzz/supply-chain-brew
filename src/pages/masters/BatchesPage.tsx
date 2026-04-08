import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { batches } from "@/data/mockData";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const BatchesPage = () => (
  <div>
    <PageHeader title="Distribution Batches" description="Manage distribution batch timings" />
    <Tabs defaultValue="list">
      <TabsList className="mb-4">
        <TabsTrigger value="list">Batch List</TabsTrigger>
        <TabsTrigger value="new">New Batch</TabsTrigger>
      </TabsList>
      <TabsContent value="list">
        <Card>
          <CardHeader><CardTitle className="text-base">All Batches</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead><tr className="border-b">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Code</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Timing</th>
              </tr></thead>
              <tbody>
                {batches.map((b) => (
                  <tr key={b.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 px-3 font-mono">{b.code}</td>
                    <td className="py-2 px-3 font-medium">{b.name}</td>
                    <td className="py-2 px-3 text-muted-foreground">{b.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="new">
        <Card>
          <CardHeader><CardTitle className="text-base">New Batch</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl">
              <div><Label>Batch Code</Label><Input placeholder="e.g. BT04" /></div>
              <div><Label>Batch Name</Label><Input placeholder="Name" /></div>
              <div><Label>Timing</Label><Input placeholder="e.g. 5:00 AM - 8:00 AM" /></div>
            </div>
            <div className="mt-6"><Button onClick={() => toast.success("Batch saved (mock)")}><Plus className="h-4 w-4 mr-1" /> Save</Button></div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);

export default BatchesPage;
