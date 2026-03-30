export interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  cpf?: string;
  phone?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

export interface Company {
  id: string;
  name: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  phone: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  userId: string;
}

export const PLAN_LIMITS: Record<string, number> = {
  FREE: 3,
  PRATA: 10,
  OURO: 50,
  DIAMANTE: 999999,
};
