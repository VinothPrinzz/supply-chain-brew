import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, Grid3x3, Receipt, User, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { dealerApi } from "@/services/dealerApi";

const tabs = [
  { to: "/dealer/indent", label: "Indent", icon: Home },
  { to: "/dealer/catalog", label: "Catalog", icon: Grid3x3 },
  { to: "/dealer/orders", label: "Orders", icon: Receipt },
  { to: "/dealer/profile", label: "Profile", icon: User },
];

const DealerLayout: React.FC = () => {
  const { data: dealer } = useQuery({ queryKey: ["dealer", "me"], queryFn: dealerApi.getCurrentDealer });
  const { data: credit } = useQuery({ queryKey: ["dealer", "credit"], queryFn: dealerApi.getCredit });
  const available = credit ? credit.limit - credit.used : 0;

  return (
    <div className="min-h-screen bg-muted/30 flex justify-center">
      <div className="w-full max-w-md bg-background min-h-screen flex flex-col relative shadow-sm">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-xs opacity-80">Dealer</div>
            <div className="font-semibold truncate">{dealer?.name || "—"}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] opacity-80">Credit available</div>
            <div className="text-sm font-semibold">₹{available.toLocaleString("en-IN")}</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 pb-20">
          <Outlet />
        </main>

        {/* Bottom tab bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-md bg-background border-t flex">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                cn(
                  "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              <t.icon className="h-5 w-5" />
              {t.label}
            </NavLink>
          ))}
        </nav>

        {/* Dev: back to admin */}
        <a
          href="/"
          className="fixed top-2 right-2 z-40 bg-background/80 backdrop-blur text-xs text-muted-foreground border rounded px-2 py-1 flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" /> Admin
        </a>
      </div>
    </div>
  );
};

export default DealerLayout;
