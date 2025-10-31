import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import AppSidebar from "./components/Layout/AppSidebar";
import AppMobileSidebar from "./components/Layout/AppMobileSidebar";
import Header from "./components/Layout/Header";
import { SidebarProvider } from "./components/ui/sidebar";
import { useIsMobile } from "./hooks/use-mobile";
import ClientsListPage from "./pages/ClientsListPage";
import ClientFormPage from "./pages/ClientFormPage";
import ContactsPage from "./pages/ContactsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import LeadsPage from "./pages/LeadsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const isMobile = useIsMobile();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setIsMobileSidebarOpen(true);
    } else {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile]);

  const handleToggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen((previous: boolean) => !previous);
  }, []);

  const handleCloseMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 transition-all duration-500">
          <div className="flex h-screen overflow-hidden">
            <SidebarProvider
              className="transition duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50"
              style={
                {
                  "--sidebar-width": "calc(var(--spacing) * 52)",
                  "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
              }
            >
              {isMobile ? (
                <AppMobileSidebar
                  isOpen={isMobileSidebarOpen}
                  onNavigate={handleCloseMobileSidebar}
                />
              ) : (
                <AppSidebar />
              )}

              <div
                className={cn(
                  "flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
                  isMobile && isMobileSidebarOpen ? "pl-16" : "pl-0"
                )}
              >
                <Header onToggleMobileSidebar={handleToggleMobileSidebar} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/agendamentos" replace />}
                    />
                    <Route path="/clientes" element={<ClientsListPage />} />
                    <Route path="/clientes/novo" element={<ClientFormPage />} />
                    <Route path="/clientes/:id/editar" element={<ClientFormPage />} />
                    <Route path="/contatos" element={<ContactsPage />} />
                    <Route path="/agendamentos" element={<AppointmentsPage />} />
                    <Route path="/leads" element={<LeadsPage />} />
                    {/* Adicione outras rotas aqui */}
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
          </div>
        </div>
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: 'white',
            },
            classNames: {
              success: '!bg-green-500 !text-white !border-green-600 [&_*]:!text-white',
              error: '!bg-red-500 !text-white !border-red-600 [&_*]:!text-white',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
