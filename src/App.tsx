import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedLayout } from "@/components/Layout/ProtectedLayout";
import LoginPage from "@/pages/LoginPage";
import ClientsListPage from "@/pages/ClientsListPage";
import ClientFormPage from "@/pages/ClientFormPage";
import ContactsPage from "@/pages/ContactsPage";
import AppointmentsPage from "@/pages/AppointmentsPage";
import LeadsPage from "@/pages/LeadsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Navigate to="/" replace />} />
              <Route path="/clientes" element={<ClientsListPage />} />
              <Route path="/clientes/novo" element={<ClientFormPage />} />
              <Route path="/clientes/:id/editar" element={<ClientFormPage />} />
              <Route path="/contatos" element={<ContactsPage />} />
              <Route path="/agendamentos" element={<AppointmentsPage />} />
              <Route path="/leads" element={<LeadsPage />} />
            </Route>
          </Routes>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "white",
              },
              classNames: {
                success:
                  "!bg-green-500 !text-white !border-green-600 [&_*]:!text-white",
                error:
                  "!bg-red-500 !text-white !border-red-600 [&_*]:!text-white",
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
