import { Router } from 'express';
import { CompanyController } from '../controllers/company.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkQuota } from '../middlewares/checkQuota.middleware';

const router = Router();
const companyController = new CompanyController();

router.use(authMiddleware);

router.post('/', checkQuota, companyController.create);
router.get('/', companyController.getAll);
router.delete('/:id', companyController.delete);

export default router;
