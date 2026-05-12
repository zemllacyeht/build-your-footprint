import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";

const Login = lazy(() => import("./pages/Login.tsx"));
const Portal = lazy(() => import("./pages/Portal.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const ServicesPage = lazy(() => import("./pages/ServicesPage.tsx"));
const ProcessPage = lazy(() => import("./pages/ProcessPage.tsx"));
const PricingPage = lazy(() => import("./pages/PricingPage.tsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.tsx"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));
const Cookies = lazy(() => import("./pages/Cookies.tsx"));
const Support = lazy(() => import("./pages/Support.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const DemoOne = lazy(() => import("./pages/DemoOne.tsx"));
const Analyze = lazy(() => import("./pages/Analyze.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/process" element={<ProcessPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/support" element={<Support />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/analyze" element={<Analyze />} />
                <Route path="/demo" element={<DemoOne />} />
                <Route
                  path="/portal"
                  element={
                    <ProtectedRoute>
                      <Portal />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
