import { Request, Response, NextFunction } from 'express';
import { CompanyService } from '../services/company.service';

export class CompanyController {
  private companyService = new CompanyService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.companyService.create(req.user!.id, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.companyService.getAllByUser(req.user!.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.companyService.delete(req.user!.id, req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
