import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load all pages
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const CustomersPage = lazy(() => import("@/pages/masters/CustomersPage"));
const ContractorsPage = lazy(() => import("@/pages/masters/ContractorsPage"));
const RoutesPage = lazy(() => import("@/pages/masters/RoutesPage"));
const BatchesPage = lazy(() => import("@/pages/masters/BatchesPage"));
const ProductsPage = lazy(() => import("@/pages/masters/ProductsPage"));
const PriceChartPage = lazy(() => import("@/pages/masters/PriceChartPage"));
const RecordIndentsPage = lazy(() => import("@/pages/sales/RecordIndentsPage"));
const DirectSalesPage = lazy(() => import("@/pages/sales/DirectSalesPage"));
const PostIndentPage = lazy(() => import("@/pages/sales/PostIndentPage"));
const CancellationRequestsPage = lazy(() => import("@/pages/sales/CancellationRequestsPage"));
const StockDashboard = lazy(() => import("@/pages/fgs/StockDashboard"));
const StockEntryPage = lazy(() => import("@/pages/fgs/StockEntryPage"));
const StockReportsPage = lazy(() => import("@/pages/fgs/StockReportsPage"));
const DispatchPage = lazy(() => import("@/pages/fgs/DispatchPage"));
const DispatchSheetPage = lazy(() => import("@/pages/fgs/DispatchSheetPage"));
const RouteSheetPage = lazy(() => import("@/pages/reports/RouteSheetPage"));
const GatePassReportPage = lazy(() => import("@/pages/reports/GatePassReportPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Lazy load sales reports
const SalesReportsModule = lazy(() => import("@/pages/sales-reports/SalesReports"));
const DailySalesStatement = lazy(() => import("@/pages/sales-reports/SalesReports").then(m => ({ default: m.DailySalesStatement })));
const DayRouteCashSales = lazy(() => import("@/pages/sales-reports/SalesReports").then(m => ({ default: m.DayRouteCashSales })));
const OfficerWiseSales = lazy(() => import("@/pages/sales-reports/SalesReports").then(m => ({ default: m.OfficerWiseSales })));
const CashSalesReport = lazy(() => import("@/pages/sales-reports/SalesReports").then(m => ({ default: m.CashSalesReport })));
const CreditSalesReport = lazy(() => import("@/pages/sales-reports/SalesReports").then(m => ({ default: m.CreditSalesReport })));
const SalesRegister = lazy(() => import("@/pages/sales-reports/SalesReports").then(m => ({ default: m.SalesRegister })));
const TalukaAgentSales = lazy(() => import("@/pages/sales-reports/SalesReports").then(m => ({ default: m.TalukaAgentSales })));
const AdhocSalesReport = lazy(() => import("@/pages/sales-reports/SalesReports").then(m => ({ default: m.AdhocSalesReport })));
const GSTStatement = lazy(() => import("@/pages/sales-reports/SalesReports").then(m => ({ default: m.GSTStatement })));

// Lazy load system pages
const TimeWindowsPage = lazy(() => import("@/pages/system/SystemPages").then(m => ({ default: m.TimeWindowsPage })));
const NotificationsPage = lazy(() => import("@/pages/system/SystemPages").then(m => ({ default: m.NotificationsPage })));
const DealerNotificationsPage = lazy(() => import("@/pages/system/SystemPages").then(m => ({ default: m.DealerNotificationsPage })));
const BannerManagementPage = lazy(() => import("@/pages/system/SystemPages").then(m => ({ default: m.BannerManagementPage })));
const RolesPage = lazy(() => import("@/pages/system/SystemPages").then(m => ({ default: m.RolesPage })));
const UserManagementPage = lazy(() => import("@/pages/system/SystemPages").then(m => ({ default: m.UserManagementPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className="p-6 space-y-4">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-4 w-96" />
    <Skeleton className="h-64 w-full" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* Masters */}
              <Route path="/masters/customers" element={<CustomersPage tab="list" />} />
              <Route path="/masters/customers/new" element={<CustomersPage tab="new" />} />
              <Route path="/masters/customers/assign-route" element={<CustomersPage tab="assign-route" />} />
              <Route path="/masters/contractors" element={<ContractorsPage tab="list" />} />
              <Route path="/masters/contractors/new" element={<ContractorsPage tab="new" />} />
              <Route path="/masters/routes" element={<RoutesPage tab="list" />} />
              <Route path="/masters/routes/new" element={<RoutesPage tab="new" />} />
              <Route path="/masters/batches" element={<BatchesPage tab="list" />} />
              <Route path="/masters/batches/new" element={<BatchesPage tab="new" />} />
              <Route path="/masters/products" element={<ProductsPage tab="list" />} />
              <Route path="/masters/products/add" element={<ProductsPage tab="add" />} />
              <Route path="/masters/products/rates" element={<ProductsPage tab="rates" />} />
              <Route path="/masters/price-chart" element={<PriceChartPage />} />
              {/* Sales */}
              <Route path="/sales/record-indents" element={<RecordIndentsPage />} />
              <Route path="/sales/post-indent" element={<PostIndentPage />} />
              <Route path="/sales/direct-sales/gate-pass" element={<DirectSalesPage tab="gate-pass" />} />
              <Route path="/sales/direct-sales/cash-customer" element={<DirectSalesPage tab="cash-customer" />} />
              <Route path="/sales/direct-sales/modify" element={<DirectSalesPage tab="modify" />} />
              <Route path="/sales/cancellations" element={<CancellationRequestsPage />} />
              {/* FGS */}
              <Route path="/fgs/dashboard" element={<StockDashboard />} />
              <Route path="/fgs/stock-entry" element={<StockEntryPage />} />
              <Route path="/fgs/reports" element={<StockReportsPage />} />
              <Route path="/fgs/dispatch" element={<DispatchPage />} />
              <Route path="/fgs/dispatch-sheet" element={<DispatchSheetPage />} />
              {/* Reports */}
              <Route path="/reports/route-sheet" element={<RouteSheetPage />} />
              <Route path="/reports/gate-pass" element={<GatePassReportPage />} />
              {/* Sales Reports */}
              <Route path="/sales-reports/daily-statement" element={<DailySalesStatement />} />
              <Route path="/sales-reports/day-route-cash" element={<DayRouteCashSales />} />
              <Route path="/sales-reports/officer-wise" element={<OfficerWiseSales />} />
              <Route path="/sales-reports/cash-sales" element={<CashSalesReport />} />
              <Route path="/sales-reports/credit-sales" element={<CreditSalesReport />} />
              <Route path="/sales-reports/register" element={<SalesRegister />} />
              <Route path="/sales-reports/taluka-agent" element={<TalukaAgentSales />} />
              <Route path="/sales-reports/adhoc" element={<AdhocSalesReport />} />
              <Route path="/sales-reports/gst" element={<GSTStatement />} />
              {/* System */}
              <Route path="/system/time-windows" element={<TimeWindowsPage />} />
              <Route path="/system/notifications" element={<NotificationsPage />} />
              <Route path="/system/dealer-notifications" element={<DealerNotificationsPage />} />
              <Route path="/system/banners" element={<BannerManagementPage />} />
              <Route path="/system/roles" element={<RolesPage />} />
              <Route path="/system/users" element={<UserManagementPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
