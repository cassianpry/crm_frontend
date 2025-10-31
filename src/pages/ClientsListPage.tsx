import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClientsList from "@/components/clients/ClientsList";

const ClientsListPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie todos os clientes cadastrados no sistema
          </p>
        </div>
        <Button
          onClick={() => navigate("/clientes/novo")}
          className="bg-yellow-500 hover:bg-yellow-400 hover:cursor-pointer text-black font-semibold"
        >
          <Plus className="mr-2 h-4 w-4 " />
          Novo Cliente
        </Button>
      </div>
      <ClientsList />
    </div>
  );
};

export default ClientsListPage;
