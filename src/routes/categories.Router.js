import { Router } from 'express';
import { getCategories, postCategories } from '../controllers/categories.Controllers.js';
import categoriesMiddlewares from '../middlewares/categories.Middlewares.js';

const router = Router();

router.get('/categories', getCategories);
router.post('/categories',categoriesMiddlewares, postCategories);

export default router;