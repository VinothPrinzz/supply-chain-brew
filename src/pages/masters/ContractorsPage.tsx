import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contractors } from "@/data/mockData";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const ContractorsPage = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  return (
    <div>
      <PageHeader title="Contractors" description="Manage contractors" />
      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Contractor List</TabsTrigger>
          <TabsTrigger value="new">New Contractor</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Contractors</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">{currentIdx + 1} / {contractors.length}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentIdx(Math.min(contractors.length - 1, currentIdx + 1))} disabled={currentIdx === contractors.length - 1}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {contractors[currentIdx] && (
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div><Label className="text-muted-foreground text-xs">Name</Label><p className="font-medium">{contractors[currentIdx].name}</p></div>
                  <div><Label className="text-muted-foreground text-xs">Contact</Label><p>{contractors[currentIdx].contact}</p></div>
                  <div><Label className="text-muted-foreground text-xs">Address</Label><p>{contractors[currentIdx].address}</p></div>
                  <div><Label className="text-muted-foreground text-xs">Status</Label>
                    <span className={`text-xs px-2 py-0.5 rounded ${contractors[currentIdx].status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {contractors[currentIdx].status}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader><CardTitle className="text-base">New Contractor</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                <div><Label>Contractor Name</Label><Input placeholder="Name" /></div>
                <div><Label>Contact</Label><Input placeholder="Phone" /></div>
                <div className="md:col-span-2"><Label>Address</Label><Input placeholder="Address" /></div>
                <div className="flex items-center gap-2 pt-5"><Switch defaultChecked /><Label>Active</Label></div>
              </div>
              <div className="mt-6"><Button onClick={() => toast.success("Contractor saved (mock)")}><Plus className="h-4 w-4 mr-1" /> Save</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractorsPage;
