import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChangeEvent } from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import { maskCnpj } from "@/lib/formatters";
import type { CompanyFormData } from "@/lib/validations/company";

interface CompanyInfoSectionProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  isEditMode: boolean;
  setValue: UseFormSetValue<CompanyFormData>;
}

export function CompanyInfoSection({
  register,
  errors,
  isEditMode,
  setValue,
}: CompanyInfoSectionProps) {
  const handleCnpjInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCnpj(event.target.value);
    event.target.value = maskedValue;
    setValue("cnpj", maskedValue, { shouldDirty: true });
  };

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
              maxLength={18}
              inputMode="numeric"
              pattern="[0-9./-]*"
              {...register("cnpj", {
                onChange: handleCnpjInputChange,
              })}
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
            />
            {errors.industria && (
              <p className="text-sm text-red-500">{errors.industria.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
