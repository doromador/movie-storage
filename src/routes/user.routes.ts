import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();
router.post('/', UserController.register);
router.post('/sessions', UserController.login);


export default router;
