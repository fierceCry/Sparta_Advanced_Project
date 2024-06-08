import express from 'express';
import { AuthsController } from '../controllers/auth.controller.js';

const authRouter = express.Router();

const authsController  = new AuthsController();

authRouter.post('/sign-up', authsController.signUp)
authRouter.post('/sign-in', authsController.signIn)

export { authRouter };