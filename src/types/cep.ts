export interface PostalCodeState {
  id: number;
  acronym: string;
  name: string;
}

export interface PostalCodeCity {
  id: number;
  name: string;
  state: PostalCodeState;
}

export interface PostalCodeResponse {
  cep: string;
  street: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: PostalCodeCity | null;
  state: PostalCodeState;
}
