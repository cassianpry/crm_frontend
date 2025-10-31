import { z } from "zod";

const phoneSchema = z
  .preprocess((value) => {
    if (typeof value !== "string") {
      return undefined;
    }
    const digitsOnly = value.replace(/\D/g, "");
    return digitsOnly.length === 0 ? undefined : digitsOnly;
  },
  z.string().refine(
    (value) => value.length === 10 || value.length === 11,
    { message: "Telefone deve conter 10 ou 11 dígitos." },
  ))
  .transform((val) => val ? Number(val) : undefined)
  .optional();

export const contactSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório."),
  email: z.string().email("Email inválido."),
  phone: phoneSchema,
  companyId: z
    .number()
    .int("Selecione uma empresa válida.")
    .positive("Selecione uma empresa."),
  isActive: z.boolean(),
});

export type ContactFormValues = z.input<typeof contactSchema>;
export type ContactFormData = z.output<typeof contactSchema>;
