import { Request, Response, NextFunction } from 'express';
import { CompanyRepository } from '../repositories/company.repository';
import { UserRepository } from '../repositories/user.repository';

export const checkQuota = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const userRepository = new UserRepository();
    const companyRepository = new CompanyRepository();

    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const planLimits: Record<string, number> = {
      FREE: 3,
      PRATA: 10,
      OURO: 50,
      DIAMANTE: Infinity,
    };

    const limit = planLimits[user.plan] || 3;
    const activeCompaniesCount = await companyRepository.countByUserId(userId);

    if (activeCompaniesCount >= limit) {
      return res.status(403).json({ 
        error: 'Limite de empresas atingido', 
        message: `Seu plano ${user.plan} permite cadastrar até ${limit} empresas. Faça um upgrade para continuar.`
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
