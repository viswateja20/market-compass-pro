import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import AppLayout from "./pages/AppLayout";
import DashboardPage from "./components/DashboardPage";
import MarketInsights from "./components/MarketInsights";
import ChatBot from "./components/ChatBot";
import DataEntry from "./components/DataEntry";
import InvoiceGenerator from "./components/InvoiceGenerator";
import ProfileSettings from "./components/ProfileSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="insights" element={<MarketInsights />} />
            <Route path="chatbot" element={<ChatBot />} />
            <Route path="data" element={<DataEntry />} />
            <Route path="invoices" element={<InvoiceGenerator />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
