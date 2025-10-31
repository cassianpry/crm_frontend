import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClientsForm from "@/components/clients/ClientsForm";

const ClientFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const clientId = id ? parseInt(id, 10) : undefined;
  const isEditMode = !!clientId;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          className="hover:cursor-pointer hover:bg-yellow-100"
          variant="ghost"
          size="icon"
          onClick={() => navigate("/clientes")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isEditMode ? "Editar Cliente" : "Novo Cliente"}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? "Atualize as informações do cliente"
              : "Preencha os dados para cadastrar um novo cliente"}
          </p>
        </div>
      </div>
      <ClientsForm clientId={clientId} />
    </div>
  );
};

export default ClientFormPage;
