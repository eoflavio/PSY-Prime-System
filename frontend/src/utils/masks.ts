export const maskCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
};

export const maskPhone = (value: string) => {
  let r = value.replace(/\D/g, '');
  if (r.length > 11) r = r.slice(0, 11);
  if (r.length > 2) {
    r = `(${r.slice(0, 2)}) ` + r.slice(2);
  }
  if (r.length > 10) {
    r = r.slice(0, 10) + '-' + r.slice(10);
  } else if (r.length > 9) {
    r = r.slice(0, 9) + '-' + r.slice(9);
  }
  return r;
};
