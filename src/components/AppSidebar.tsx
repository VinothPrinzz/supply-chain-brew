import {
  Users, Truck, MapPin, Clock, Package, Home as HomeIcon, FileText,
  BarChart3, Warehouse, ClipboardList, ShoppingCart, Send,
  CreditCard, BookOpen, TrendingUp, Receipt, Map, Zap, FileSpreadsheet,
  ChevronDown, Settings
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

interface NavGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Masters",
    icon: Settings,
    items: [
      { title: "Customers", url: "/masters/customers", icon: Users },
      { title: "Contractors", url: "/masters/contractors", icon: Truck },
      { title: "Routes", url: "/masters/routes", icon: MapPin },
      { title: "Batches", url: "/masters/batches", icon: Clock },
      { title: "Products", url: "/masters/products", icon: Package },
      { title: "Price Chart", url: "/masters/price-chart", icon: FileText },
    ],
  },
  {
    label: "Sales Operations",
    icon: ShoppingCart,
    items: [
      { title: "Record Indents", url: "/sales/record-indents", icon: ClipboardList },
      { title: "Direct Sales", url: "/sales/direct-sales", icon: Zap },
      { title: "Post Indent", url: "/sales/post-indent", icon: Send },
    ],
  },
  {
    label: "FGS - Stock",
    icon: Warehouse,
    items: [
      { title: "Stock Dashboard", url: "/fgs/dashboard", icon: BarChart3 },
      { title: "Stock Entry", url: "/fgs/stock-entry", icon: Package },
      { title: "Stock Reports", url: "/fgs/reports", icon: FileText },
      { title: "Dispatch", url: "/fgs/dispatch", icon: Send },
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
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

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
        {/* Dashboard link */}
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
          const isGroupActive = group.items.some((item) => location.pathname.startsWith(item.url));

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
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={item.url}
                              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              className="hover:bg-sidebar-accent/50"
                            >
                              <item.icon className="h-4 w-4" />
                              {!collapsed && <span>{item.title}</span>}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
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
