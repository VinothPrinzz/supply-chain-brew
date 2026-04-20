import {
  Users, Truck, MapPin, Clock, Package, Home as HomeIcon, FileText,
  BarChart3, Warehouse, ClipboardList, ShoppingCart, Send,
  CreditCard, BookOpen, TrendingUp, Receipt, Map, Zap, FileSpreadsheet,
  ChevronDown, Settings, XCircle, Bell, Image, Shield, UserCog,
  Timer, Megaphone, Wallet, Plus, Tag,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSubGroup {
  label: string;
  items: NavItem[];
}

interface NavGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: NavItem[];
  subGroups?: NavSubGroup[];
}

const navGroups: NavGroup[] = [
  {
    label: "Masters",
    icon: Settings,
    subGroups: [
      {
        label: "Customers",
        items: [
          { title: "All Customers", url: "/masters/customers", icon: Users },
          { title: "New Customer", url: "/masters/customers/new", icon: Users },
          { title: "Assign Route", url: "/masters/customers/assign-route", icon: MapPin },
        ],
      },
      {
        label: "Contractors",
        items: [
          { title: "All Contractors", url: "/masters/contractors", icon: Truck },
          { title: "New Contractor", url: "/masters/contractors/new", icon: Truck },
        ],
      },
      {
        label: "Routes",
        items: [
          { title: "All Routes", url: "/masters/routes", icon: MapPin },
          { title: "New Route", url: "/masters/routes/new", icon: MapPin },
        ],
      },
      {
        label: "Batches",
        items: [
          { title: "All Batches", url: "/masters/batches", icon: Clock },
          { title: "New Batch", url: "/masters/batches/new", icon: Clock },
        ],
      },
      {
        label: "Products",
        items: [
          { title: "All Products", url: "/masters/products", icon: Package },
          { title: "Add Packet", url: "/masters/products/add", icon: Package },
          { title: "Rate Categories", url: "/masters/products/rates", icon: FileText },
          { title: "Price Revisions", url: "/masters/price-revisions", icon: Tag },
        ],
      },
      {
        label: "Price Chart",
        items: [
          { title: "View Price Chart", url: "/masters/price-chart", icon: FileText },
        ],
      },
    ],
  },
  {
    label: "Sales Operations",
    icon: ShoppingCart,
    subGroups: [
      {
        label: "Indents",
        items: [
          { title: "Record Indents", url: "/sales/record-indents", icon: ClipboardList },
          { title: "Post Indent", url: "/sales/post-indent", icon: Send },
        ],
      },
      {
        label: "Direct Sales",
        items: [
          { title: "Gate Pass (Agents)", url: "/sales/direct-sales/gate-pass", icon: Zap },
          { title: "Cash Customer", url: "/sales/direct-sales/cash-customer", icon: CreditCard },
          { title: "Modify Indent", url: "/sales/direct-sales/modify", icon: ClipboardList },
        ],
      },
      {
        label: "Cancellations",
        items: [
          { title: "Cancellation Requests", url: "/sales/cancellations", icon: XCircle },
        ],
      },
      {
        label: "Invoices",
        items: [
          { title: "All Invoices", url: "/sales/invoices", icon: Receipt },
        ],
      },
    ],
  },
  {
    label: "FGS - Stock",
    icon: Warehouse,
    items: [
      { title: "Stock Overview", url: "/fgs/dashboard", icon: BarChart3 },
      { title: "Stock Entry", url: "/fgs/stock-entry", icon: Package },
      { title: "Stock Reports", url: "/fgs/reports", icon: FileText },
      { title: "Dispatch Sheet", url: "/fgs/dispatch-sheet", icon: Send },
      { title: "Create Dispatch", url: "/fgs/dispatch/create", icon: Plus },
    ],
  },
  {
    label: "Finance",
    icon: Wallet,
    items: [
      { title: "Payments", url: "/finance/payments", icon: CreditCard },
      { title: "Dealer Ledger", url: "/finance/ledger", icon: BookOpen },
    ],
  },
  {
    label: "Reports",
    icon: FileText,
    items: [
      { title: "Route Sheet", url: "/reports/route-sheet", icon: MapPin },
      { title: "Gate Pass Report", url: "/reports/gate-pass", icon: FileText },
    ],
  },
  {
    label: "Sales Reports",
    icon: TrendingUp,
    items: [
      { title: "Daily Sales Statement", url: "/sales-reports/daily-statement", icon: FileSpreadsheet },
      { title: "Day/Route Wise Cash", url: "/sales-reports/day-route-cash", icon: CreditCard },
      { title: "Officer Wise Sales", url: "/sales-reports/officer-wise", icon: Users },
      { title: "Cash Sales", url: "/sales-reports/cash-sales", icon: Receipt },
      { title: "Credit Sales", url: "/sales-reports/credit-sales", icon: BookOpen },
      { title: "Sales Register", url: "/sales-reports/register", icon: ClipboardList },
      { title: "Taluka/Agent Wise", url: "/sales-reports/taluka-agent", icon: Map },
      { title: "Adhoc Sales", url: "/sales-reports/adhoc", icon: Zap },
      { title: "GST Statement", url: "/sales-reports/gst", icon: FileText },
    ],
  },
  {
    label: "System",
    icon: Settings,
    items: [
      { title: "Time Windows", url: "/system/time-windows", icon: Timer },
      { title: "Notifications", url: "/system/notifications", icon: Bell },
      { title: "Dealer Notifications", url: "/system/dealer-notifications", icon: Megaphone },
      { title: "Banner Management", url: "/system/banners", icon: Image },
      { title: "Roles & Access", url: "/system/roles", icon: Shield },
      { title: "User Management", url: "/system/users", icon: UserCog },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const getAllUrls = (group: NavGroup): string[] => {
    const urls: string[] = [];
    group.items?.forEach((item) => urls.push(item.url));
    group.subGroups?.forEach((sg) => sg.items.forEach((item) => urls.push(item.url)));
    return urls;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        {!collapsed ? (
          <div>
            <h2 className="text-sm font-bold text-sidebar-primary-foreground">Haveri Milk Union</h2>
            <p className="text-xs text-sidebar-foreground/60">Marketing Module</p>
          </div>
        ) : (
          <span className="text-lg font-bold text-sidebar-primary-foreground">H</span>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                    <HomeIcon className="h-4 w-4" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {navGroups.map((group) => {
          const allUrls = getAllUrls(group);
          const isGroupActive = allUrls.some((url) => location.pathname === url || location.pathname.startsWith(url + "/"));

          return (
            <Collapsible key={group.label} defaultOpen={isGroupActive}>
              <SidebarGroup>
                <CollapsibleTrigger className="w-full">
                  <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:text-sidebar-accent-foreground">
                    <span className="flex items-center gap-2">
                      <group.icon className="h-3.5 w-3.5" />
                      {!collapsed && group.label}
                    </span>
                    {!collapsed && <ChevronDown className="h-3 w-3 transition-transform [[data-state=open]_&]:rotate-180" />}
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    {/* Flat items */}
                    {group.items && (
                      <SidebarMenu>
                        {group.items.map((item) => (
                          <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton asChild>
                              <NavLink to={item.url} activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium" className="hover:bg-sidebar-accent/50">
                                <item.icon className="h-4 w-4" />
                                {!collapsed && <span>{item.title}</span>}
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    )}

                    {/* Sub-groups */}
                    {group.subGroups?.map((sg) => (
                      <div key={sg.label} className="mt-1">
                        {!collapsed && (
                          <p className="px-4 py-1 text-[11px] font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                            {sg.label}
                          </p>
                        )}
                        <SidebarMenu>
                          {sg.items.map((item) => (
                            <SidebarMenuItem key={item.url}>
                              <SidebarMenuButton asChild>
                                <NavLink to={item.url} activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium" className="hover:bg-sidebar-accent/50">
                                  <item.icon className="h-4 w-4" />
                                  {!collapsed && <span>{item.title}</span>}
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </div>
                    ))}
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-4 py-2">
        {!collapsed && (
          <p className="text-[10px] text-sidebar-foreground/40">v1.0 — Haveri Dairy</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
