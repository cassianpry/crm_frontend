export interface Contact {
  id?: number;
  name: string;
  email: string;
  phone?: number;
  companyId?: number;
  isActive?: boolean;
  company?: {
    id: number;
    nomeFantasia: string;
    razaoSocial: string;
  };
}

export interface Company {
  id: number;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  industria: string;
  endereco: string;
  complemento?: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  isActive: boolean;
  contacts: Contact[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedCompanies {
  data: Company[];
  meta: PaginationMeta;
}

export interface CreateCompanyDto {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  industria: string;
  endereco: string;
  complemento?: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  contact: Contact;
}

export type UpdateCompanyDto = Partial<CreateCompanyDto>;
