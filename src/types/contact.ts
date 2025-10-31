export interface UpdateContactDto {
  name?: string;
  email?: string;
  phone?: number;
  isActive?: boolean;
  companyId?: number;
}

export interface CreateContactDto {
  name: string;
  email: string;
  phone?: number;
  companyId: number;
  isActive?: boolean;
}
