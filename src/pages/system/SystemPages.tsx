import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { timeWindows, notificationSettings, banners, systemUsers, roles } from "@/data/mockData";
import { Edit, Plus, Send, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

// 9. Time Windows — removed description column
export const TimeWindowsPage = () => (
  <div>
    <PageHeader title="Time Windows" description="Configure indent and operation time windows" />
    <Card>
      <CardContent className="pt-6">
        <table className="w-full text-sm">
          <thead><tr className="border-b">
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Start</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">End</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Edit</th>
          </tr></thead>
          <tbody>
            {timeWindows.map((tw) => (
              <tr key={tw.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="py-2 px-3 font-medium">{tw.name}</td>
                <td className="py-2 px-3">{tw.startTime}</td>
                <td className="py-2 px-3">{tw.endTime}</td>
                <td className="py-2 px-3"><span className={`text-xs px-2 py-0.5 rounded ${tw.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{tw.status}</span></td>
                <td className="py-2 px-3"><Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
);

export const NotificationsPage = () => (
  <div>
    <PageHeader title="Notification Settings" description="Configure which notifications are sent and to whom" />
    <Card>
      <CardContent className="pt-6">
        <table className="w-full text-sm">
          <thead><tr className="border-b">
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Type</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Description</th>
            <th className="text-center py-2 px-3 font-medium text-muted-foreground">Admin</th>
            <th className="text-center py-2 px-3 font-medium text-muted-foreground">Dealer</th>
            <th className="text-center py-2 px-3 font-medium text-muted-foreground">Contractor</th>
            <th className="text-center py-2 px-3 font-medium text-muted-foreground">Enabled</th>
          </tr></thead>
          <tbody>
            {notificationSettings.map((ns) => (
              <tr key={ns.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="py-2 px-3 font-medium">{ns.type}</td>
                <td className="py-2 px-3 text-muted-foreground">{ns.description}</td>
                <td className="py-2 px-3 text-center"><Switch checked={ns.sendToAdmin} /></td>
                <td className="py-2 px-3 text-center"><Switch checked={ns.sendToDealer} /></td>
                <td className="py-2 px-3 text-center"><Switch checked={ns.sendToContractor} /></td>
                <td className="py-2 px-3 text-center"><Switch checked={ns.enabled} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
);

export const DealerNotificationsPage = () => (
  <div>
    <PageHeader title="Dealer Notifications" description="Send notifications to dealers" />
    <Card className="mb-6">
      <CardHeader><CardTitle className="text-base">Send New Notification</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
          <div className="md:col-span-2"><Label>Title</Label><Input placeholder="Notification title" /></div>
          <div className="md:col-span-2"><Label>Message</Label><Input placeholder="Notification message" /></div>
          <div><Label>Send To</Label>
            <Select><SelectTrigger><SelectValue placeholder="All dealers" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Dealers</SelectItem><SelectItem value="route">By Route</SelectItem><SelectItem value="specific">Specific Dealer</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4"><Button onClick={() => toast.success("Notification sent (mock)")}><Send className="h-4 w-4 mr-1" /> Send</Button></div>
      </CardContent>
    </Card>
  </div>
);

// 12. Banner Management with category
const bannerCategories = ["Announcement", "Sales", "New Launch", "Festival", "Promotion"];

export const BannerManagementPage = () => (
  <div>
    <PageHeader title="Banner Management" description="Manage dealer app banners" actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Banner</Button>} />

    {/* Add Banner Form */}
    <Card className="mb-6">
      <CardHeader><CardTitle className="text-base">Add New Banner</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
          <div className="md:col-span-2"><Label>Title</Label><Input placeholder="Banner title" /></div>
          <div><Label>Category</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{bannerCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Upload Image</Label><Input type="file" accept="image/*" /></div>
          <div><Label>Start Date</Label><Input type="date" /></div>
          <div><Label>End Date</Label><Input type="date" /></div>
        </div>
        <div className="mt-4"><Button onClick={() => toast.success("Banner added (mock)")}><Plus className="h-4 w-4 mr-1" /> Save Banner</Button></div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {banners.map((b) => (
        <Card key={b.id}>
          <CardContent className="pt-6">
            <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center text-muted-foreground text-sm">Banner Image</div>
            <h3 className="font-medium">{b.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{b.category}</p>
            <p className="text-xs text-muted-foreground mt-1">{b.startDate} — {b.endDate}</p>
            <div className="flex items-center justify-between mt-3">
              <span className={`text-xs px-2 py-0.5 rounded ${b.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{b.status}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// 10. Roles & Access — editable permissions
const allPermissions = ["All access", "System settings", "User management", "Reports", "Masters", "Sales", "FGS", "View settings", "Record indents", "Stock entry", "View reports", "View dashboard"];

export const RolesPage = () => {
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [rolePerms, setRolePerms] = useState<Record<string, string[]>>(
    Object.fromEntries(roles.map(r => [r.role, [...r.permissions]]))
  );

  const togglePerm = (role: string, perm: string) => {
    setRolePerms(prev => {
      const current = prev[role] || [];
      const updated = current.includes(perm) ? current.filter(p => p !== perm) : [...current, perm];
      return { ...prev, [role]: updated };
    });
  };

  return (
    <div>
      <PageHeader title="Roles & Access" description="Configure user roles and permissions" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((r) => (
          <Card key={r.role}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{r.role}</CardTitle>
                {editingRole === r.role ? (
                  <Button size="sm" variant="default" onClick={() => { setEditingRole(null); toast.success(`${r.role} permissions saved (mock)`); }}>
                    <Save className="h-3.5 w-3.5 mr-1" /> Save
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setEditingRole(r.role)}>
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editingRole === r.role ? (
                <div className="grid grid-cols-2 gap-2">
                  {allPermissions.map(p => (
                    <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox checked={(rolePerms[r.role] || []).includes(p)} onCheckedChange={() => togglePerm(r.role, p)} />
                      {p}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {(rolePerms[r.role] || r.permissions).map(p => (
                    <span key={p} className="text-xs px-2 py-1 rounded bg-secondary">{p}</span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const UserManagementPage = () => (
  <div>
    <PageHeader title="User Management" description="Manage system users" actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add User</Button>} />
    <Card>
      <CardContent className="pt-6">
        <table className="w-full text-sm">
          <thead><tr className="border-b">
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Email</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Role</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Last Login</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Actions</th>
          </tr></thead>
          <tbody>
            {systemUsers.map((u) => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="py-2 px-3 font-medium">{u.name}</td>
                <td className="py-2 px-3">{u.email}</td>
                <td className="py-2 px-3"><span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{u.role}</span></td>
                <td className="py-2 px-3"><span className={`text-xs px-2 py-0.5 rounded ${u.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{u.status}</span></td>
                <td className="py-2 px-3 text-muted-foreground text-xs">{u.lastLogin}</td>
                <td className="py-2 px-3"><Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
);
