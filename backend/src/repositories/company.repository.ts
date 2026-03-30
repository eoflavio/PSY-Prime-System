import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';

export class CompanyRepository {
  async create(data: Prisma.CompanyUncheckedCreateInput) {
    return prisma.company.create({ data });
  }

  async findByUserId(userId: string) {
    return prisma.company.findMany({ where: { userId } });
  }

  async countByUserId(userId: string) {
    return prisma.company.count({ where: { userId } });
  }

  async findByIdAndUserId(id: string, userId: string) {
    return prisma.company.findFirst({ where: { id, userId } });
  }

  async delete(id: string) {
    return prisma.company.delete({ where: { id } });
  }
}
