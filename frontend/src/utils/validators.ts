export const isValidCNPJ = (cnpj: string): boolean => {
  const b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const str = cnpj.replace(/[^\d]/g, '');
  if (str.length !== 14) return false;
  if (/0{14}/.test(str)) return false;

  let n = 0;
  for (let i = 0; i < 12; i++) {
    n += parseInt(str[i]) * b[i + 1];
  }
  let digit = n % 11 < 2 ? 0 : 11 - (n % 11);
  if (parseInt(str[12]) !== digit) return false;

  n = 0;
  for (let i = 0; i <= 12; i++) {
    n += parseInt(str[i]) * b[i];
  }
  digit = n % 11 < 2 ? 0 : 11 - (n % 11);
  if (parseInt(str[13]) !== digit) return false;
  return true;
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
