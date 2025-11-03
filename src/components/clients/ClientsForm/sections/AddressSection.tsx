import { Loader2 } from "lucide-react";
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

interface AddressSectionProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  cepField: ReturnType<UseFormRegister<CompanyFormData>>;
  isFetchingPostalCode: boolean;
  isNumeroEditable: boolean;
}

export function AddressSection({
  register,
  errors,
  cepField,
  isFetchingPostalCode,
  isNumeroEditable,
}: AddressSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Endereço</CardTitle>
        <CardDescription>Localização da empresa</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="endereco">Endereço *</Label>
            <Input
              id="endereco"
              placeholder="Rua, Avenida, etc."
              disabled
              {...register("endereco")}
            />
            {errors.endereco && (
              <p className="text-sm text-red-500">
                {errors.endereco.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numero">Número *</Label>
            <Input
              id="numero"
              placeholder="123"
              disabled={!isNumeroEditable}
              {...register("numero")}
            />
            {errors.numero && (
              <p className="text-sm text-red-500">{errors.numero.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              placeholder="Apto, Sala, etc."
              {...register("complemento")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bairro">Bairro *</Label>
            <Input
              id="bairro"
              placeholder="Bairro"
              disabled
              {...register("bairro")}
            />
            {errors.bairro && (
              <p className="text-sm text-red-500">{errors.bairro.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cep">CEP *</Label>
            <div className="relative">
              <Input
                id="cep"
                placeholder="00000-000"
                maxLength={9}
                inputMode="numeric"
                autoComplete="postal-code"
                {...cepField}
              />
              {isFetchingPostalCode && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />
              )}
            </div>
            {errors.cep && (
              <p className="text-sm text-red-500">{errors.cep.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade *</Label>
            <Input
              id="cidade"
              placeholder="Cidade"
              disabled
              {...register("cidade")}
            />
            {errors.cidade && (
              <p className="text-sm text-red-500">{errors.cidade.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado *</Label>
            <Input
              id="estado"
              placeholder="SP"
              maxLength={2}
              disabled
              {...register("estado")}
            />
            {errors.estado && (
              <p className="text-sm text-red-500">{errors.estado.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
