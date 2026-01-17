import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Health from "./pages/Health";
import Results from "./pages/Results";
import Chatbot from "./pages/Chatbot";
import BrainTumor from "./pages/BrainTumor";
import FetalHealth from "./pages/FetalHealth";
import PregnancyDifficulty from "./pages/PregnancyDifficulty";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Index />} />
            <Route path="/health" element={<Health />} />
            <Route path="/results" element={<Results />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/brain-tumor" element={<BrainTumor />} />
            <Route path="/fetal-health" element={<FetalHealth />} />
            <Route path="/pregnancy-difficulty" element={<PregnancyDifficulty />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
