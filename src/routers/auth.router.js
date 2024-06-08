import express from 'express';
import { AuthsController } from '../controllers/auth.controller.js';
// import { catchAsync } from '../middlewarmies/error-handler.middleware.js';

const authRouter = express.Router();

const authsController  = new AuthsController();

/** 회원가입  **/
authRouter.post('/sign-up', authsController.signUp)

/** 로그인 **/
authRouter.post('/sign-in', authsController.signIn)

export { authRouter };