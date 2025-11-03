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

interface ContactSectionProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  contactPhoneField: ReturnType<UseFormRegister<CompanyFormData>>;
}

export function ContactSection({
  register,
  errors,
  contactPhoneField,
}: ContactSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contato</CardTitle>
        <CardDescription>Informações de contato principal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact.name">Nome do Contato *</Label>
            <Input
              id="contact.name"
              placeholder="Nome completo"
              {...register("contact.name")}
              autoComplete="off"
            />
            {errors.contact?.name && (
              <p className="text-sm text-red-500">
                {errors.contact.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact.email">Email *</Label>
            <Input
              id="contact.email"
              type="email"
              placeholder="contato@empresa.com"
              {...register("contact.email")}
              autoComplete="off"
            />
            {errors.contact?.email && (
              <p className="text-sm text-red-500">
                {errors.contact.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact.phone">Telefone</Label>
            <Input
              id="contact.phone"
              placeholder="(00) 00000-0000"
              maxLength={15}
              inputMode="tel"
              autoComplete="off"
              {...contactPhoneField}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
