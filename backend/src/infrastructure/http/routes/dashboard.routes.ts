import { Router } from 'express';
import { getDashboardData } from '../controllers/DashboardController';

const router = Router();

router.get('/', getDashboardData);

export default router;
