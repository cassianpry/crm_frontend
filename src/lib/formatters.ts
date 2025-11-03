export const sanitizeCnpj = (cnpj: string): string => cnpj.replace(/\D/g, "");

export const maskCnpj = (cnpj: string): string => {
  const digitsOnly = sanitizeCnpj(cnpj).slice(0, 14);

  if (digitsOnly.length <= 2) {
    return digitsOnly;
  }

  if (digitsOnly.length <= 5) {
    return `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2)}`;
  }

  if (digitsOnly.length <= 8) {
    return `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2, 5)}.${digitsOnly.slice(5)}`;
  }

  if (digitsOnly.length <= 12) {
    return `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2, 5)}.${digitsOnly.slice(5, 8)}/${digitsOnly.slice(8)}`;
  }

  return `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2, 5)}.${digitsOnly.slice(5, 8)}/${digitsOnly.slice(8, 12)}-${digitsOnly.slice(12)}`;
};

export const formatCNPJ = (cnpj: string): string => {
  const cleaned = sanitizeCnpj(cnpj);

  if (cleaned.length === 14) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
  }

  return cnpj;
};

export const sanitizeCep = (cep: string): string => cep.replace(/\D/g, '');

export const maskCep = (cep: string): string => {
  const digitsOnly = sanitizeCep(cep).slice(0, 8);

  if (digitsOnly.length <= 5) {
    return digitsOnly;
  }

  return `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5)}`;
};

export const formatCEP = (cep: string): string => {
  const cleaned = sanitizeCep(cep);

  if (cleaned.length === 8) {
    return cleaned.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  return cep;
};

export const sanitizePhone = (phone: string): string => phone.replace(/\D/g, '');

export const maskPhone = (phone: string): string => {
  const digitsOnly = sanitizePhone(phone).slice(0, 11);

  if (digitsOnly.length === 0) {
    return "";
  }

  if (digitsOnly.length <= 2) {
    return `(${digitsOnly}`;
  }

  if (digitsOnly.length <= 6) {
    return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2)}`;
  }

  if (digitsOnly.length <= 10) {
    return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 6)}-${digitsOnly.slice(6)}`;
  }

  return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 7)}-${digitsOnly.slice(7)}`;
};

export const formatPhone = (phone: string): string => {
  const cleaned = sanitizePhone(phone);

  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};
