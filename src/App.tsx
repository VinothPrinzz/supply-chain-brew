import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import CustomersPage from "@/pages/masters/CustomersPage";
import ContractorsPage from "@/pages/masters/ContractorsPage";
import RoutesPage from "@/pages/masters/RoutesPage";
import BatchesPage from "@/pages/masters/BatchesPage";
import ProductsPage from "@/pages/masters/ProductsPage";
import PriceChartPage from "@/pages/masters/PriceChartPage";
import RecordIndentsPage from "@/pages/sales/RecordIndentsPage";
import DirectSalesPage from "@/pages/sales/DirectSalesPage";
import PostIndentPage from "@/pages/sales/PostIndentPage";
import StockDashboard from "@/pages/fgs/StockDashboard";
import StockEntryPage from "@/pages/fgs/StockEntryPage";
import StockReportsPage from "@/pages/fgs/StockReportsPage";
import DispatchPage from "@/pages/fgs/DispatchPage";
import RouteSheetPage from "@/pages/reports/RouteSheetPage";
import GatePassReportPage from "@/pages/reports/GatePassReportPage";
import {
  DailySalesStatement, DayRouteCashSales, OfficerWiseSales,
  CashSalesReport, CreditSalesReport, SalesRegister,
  TalukaAgentSales, AdhocSalesReport, GSTStatement,
} from "@/pages/sales-reports/SalesReports";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Masters */}
            <Route path="/masters/customers" element={<CustomersPage />} />
            <Route path="/masters/contractors" element={<ContractorsPage />} />
            <Route path="/masters/routes" element={<RoutesPage />} />
            <Route path="/masters/batches" element={<BatchesPage />} />
            <Route path="/masters/products" element={<ProductsPage />} />
            <Route path="/masters/price-chart" element={<PriceChartPage />} />
            {/* Sales Operations */}
            <Route path="/sales/record-indents" element={<RecordIndentsPage />} />
            <Route path="/sales/direct-sales" element={<DirectSalesPage />} />
            <Route path="/sales/post-indent" element={<PostIndentPage />} />
            {/* FGS */}
            <Route path="/fgs/dashboard" element={<StockDashboard />} />
            <Route path="/fgs/stock-entry" element={<StockEntryPage />} />
            <Route path="/fgs/reports" element={<StockReportsPage />} />
            <Route path="/fgs/dispatch" element={<DispatchPage />} />
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
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
