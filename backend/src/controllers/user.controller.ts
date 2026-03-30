import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  password: z.string().min(6).optional(),
  cpf: z.string().min(11).optional(),
  phone: z.string().min(10).optional(),
  cep: z.string().min(8).optional(),
  rua: z.string().min(2).optional(),
  numero: z.string().min(1).optional(),
  bairro: z.string().min(2).optional(),
  cidade: z.string().min(2).optional(),
  estado: z.string().length(2).optional()
});

export class UserController {
  private userRepository = new UserRepository();

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = updateProfileSchema.parse(req.body);
      const dataToUpdate: any = { ...validated };
      
      if (validated.password) dataToUpdate.password = await bcrypt.hash(validated.password, 10);
      
      const updatedUser = await this.userRepository.update(req.user!.id, dataToUpdate);
      
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.status(200).json(userWithoutPassword);
    } catch (err) {
      next(err);
    }
  }

  updatePlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { plan } = z.object({ plan: z.string() }).parse(req.body);
      const updatedUser = await this.userRepository.update(req.user!.id, { plan });
      const { password, ...userWithoutPassword } = updatedUser;
      res.status(200).json(userWithoutPassword);
    } catch (err) {
      next(err);
    }
  }
}
