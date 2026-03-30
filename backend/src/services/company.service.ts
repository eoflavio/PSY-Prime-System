import { CompanyRepository } from '../repositories/company.repository';
import { z } from 'zod';

const companySchema = z.object({
  name: z.string().min(2),
  razaoSocial: z.string().min(2),
  nomeFantasia: z.string().min(2),
  cep: z.string().min(8),
  rua: z.string().min(2),
  numero: z.string().min(1),
  bairro: z.string().min(2),
  cidade: z.string().min(2),
  estado: z.string().length(2),
  cnpj: z.string().min(14),
  email: z.string().email(),
  phone: z.string().min(10)
});

export class CompanyService {
  private companyRepository = new CompanyRepository();

  async create(userId: string, data: any) {
    const validated = companySchema.parse(data);
    return this.companyRepository.create({ ...validated, userId });
  }

  async getAllByUser(userId: string) {
    return this.companyRepository.findByUserId(userId);
  }

  async delete(userId: string, companyId: string) {
    const company = await this.companyRepository.findByIdAndUserId(companyId, userId);
    if (!company) {
      throw { status: 404, message: 'Empresa não encontrada ou você não tem permissão' };
    }
    await this.companyRepository.delete(companyId);
    return { message: 'Empresa deletada com sucesso' };
  }
}
