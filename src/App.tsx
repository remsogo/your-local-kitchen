import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { getLocaleFromPathname } from "@/lib/i18n";
import Header from "./components/Header";
import StickyOrderBar from "./components/StickyOrderBar";
import Footer from "./components/Footer";
import PageMeta from "./components/PageMeta";

const Index = lazy(() => import("./pages/Index"));
const Menu = lazy(() => import("./pages/Menu"));
const Contact = lazy(() => import("./pages/Contact"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const News = lazy(() => import("./pages/News"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const RouteLoadingFallback = () => {
  const location = useLocation();
  const locale = getLocaleFromPathname(location.pathname);
  return (
    <div className="min-h-screen pt-32 flex items-center justify-center">
      <p className="text-muted-foreground">{locale === "fr" ? "Chargement..." : "Loading..."}</p>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageMeta />
        <Header />
        <StickyOrderBar />
        <main data-testid="app-main">
          <Suspense
            fallback={<RouteLoadingFallback />}
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/actualites" element={<News />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />

              <Route path="/en" element={<Index />} />
              <Route path="/en/menu" element={<Menu />} />
              <Route path="/en/contact" element={<Contact />} />
              <Route path="/en/news" element={<News />} />
              <Route path="/en/legal-notice" element={<MentionsLegales />} />

              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
