export const formatCNPJ = (cnpj: string): string => {
  // Remove tudo que não é dígito
  const cleaned = cnpj.replace(/\D/g, '');
  
  // Aplica a máscara 00.000.000/0000-00
  if (cleaned.length === 14) {
    return cleaned.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }
  
  // Retorna o valor original se não tiver 14 dígitos
  return cnpj;
};

export const formatCEP = (cep: string): string => {
  const cleaned = cep.replace(/\D/g, '');
  
  if (cleaned.length === 8) {
    return cleaned.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }
  
  return cep;
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  
  return phone;
};
