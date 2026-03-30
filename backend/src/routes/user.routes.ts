import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

router.use(authMiddleware);

router.put('/profile', userController.updateProfile);
router.put('/plan', userController.updatePlan);

export default router;
