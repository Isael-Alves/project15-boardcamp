import { Router } from 'express';
import {getGames, postGames} from '../controllers/games.Controllers.js';
import gamesPostMiddlewares from '../middlewares/games.Middlewares.js';

const router = Router();

router.get('/games', getGames);
router.post('/games',gamesPostMiddlewares, postGames);

export default router;