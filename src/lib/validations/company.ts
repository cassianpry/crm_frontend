import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || /^\d+$/.test(value), {
    message: "Telefone deve conter apenas números",
  })
  .refine((value) => value === "" || value.length === 11, {
    message: "Telefone deve ter 11 dígitos",
  });

const contactSchema = z.object({
  name: z.string().min(1, "Nome do contato é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: phoneSchema,
});

export const companySchema = z.object({
  cnpj: z
    .string()
    .min(1, "CNPJ é obrigatório")
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/, "CNPJ inválido"),
  razaoSocial: z.string().min(1, "Razão Social é obrigatória"),
  nomeFantasia: z.string().min(1, "Nome Fantasia é obrigatório"),
  industria: z.string().min(1, "Indústria é obrigatória"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  complemento: z.string().optional(),
  numero: z.string().min(1, "Número é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cep: z
    .string()
    .min(1, "CEP é obrigatório")
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z
    .string()
    .min(2, "Estado é obrigatório")
    .max(2, "Use a sigla do estado"),
  contact: contactSchema,
});

export type CompanyFormData = z.infer<typeof companySchema>;
