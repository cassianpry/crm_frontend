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

export type SortField =
  | "cnpj"
  | "nomeFantasia"
  | "razaoSocial"
  | "industria"
  | "cidade";

export type SortOrder = "asc" | "desc" | null;

export interface DeleteDialogState {
  open: boolean;
  company: { id: number; nomeFantasia: string } | null;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
}

export interface ContactsManagerState {
  editingContact: Contact | null;
  isAddingContact: boolean;
  contactSearchTerm: string;
  contactFormData: ContactFormData;
}
