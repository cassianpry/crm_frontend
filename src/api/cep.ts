import apiClient from "./client";
import type { PostalCodeResponse } from "@/types/cep";

const sanitizeCep = (rawCep: string) => rawCep.replace(/\D/g, "");

export const cepApi = {
  async findByCep(rawCep: string) {
    const sanitizedCep = sanitizeCep(rawCep);
    if (sanitizedCep.length !== 8) {
      throw new Error("CEP deve conter 8 dígitos após sanitização");
    }

    const { data } = await apiClient.get<PostalCodeResponse | null>(
      `/cep/${sanitizedCep}`
    );

    return data;
  },
};

export type { PostalCodeResponse };
