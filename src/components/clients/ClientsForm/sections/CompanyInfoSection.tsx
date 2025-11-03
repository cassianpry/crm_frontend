import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CompanyFormData } from "@/lib/validations/company";

interface CompanyInfoSectionProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  isEditMode: boolean;
}

export function CompanyInfoSection({
  register,
  errors,
  isEditMode,
}: CompanyInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Editar" : "Cadastrar"} Cliente</CardTitle>
        <CardDescription>
          {isEditMode
            ? "Atualize as informações do cliente"
            : "Informações básicas da empresa"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ *</Label>
            <Input
              id="cnpj"
              placeholder="00.000.000/0000-00"
              {...register("cnpj")}
            />
            {errors.cnpj && (
              <p className="text-sm text-red-500">{errors.cnpj.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="razaoSocial">Razão Social *</Label>
            <Input
              id="razaoSocial"
              placeholder="Razão Social"
              {...register("razaoSocial")}
            />
            {errors.razaoSocial && (
              <p className="text-sm text-red-500">
                {errors.razaoSocial.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomeFantasia">Nome Fantasia *</Label>
            <Input
              id="nomeFantasia"
              placeholder="Nome Fantasia"
              {...register("nomeFantasia")}
            />
            {errors.nomeFantasia && (
              <p className="text-sm text-red-500">
                {errors.nomeFantasia.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="industria">Indústria *</Label>
            <Input
              id="industria"
              placeholder="Ex: Tecnologia, Varejo, etc."
              {...register("industria")}
            />
            {errors.industria && (
              <p className="text-sm text-red-500">
                {errors.industria.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
