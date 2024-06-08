import express from 'express';
import { AuthsController } from '../controllers/auth.controller.js';
import { userCreateSchema } from '../middlewarmies/validation/sign-up.validation.middlware.js';
import { userLoginSchema } from '../middlewarmies/validation/sign-in.validateion.middlewar.js';
const authRouter = express.Router();

const authsController  = new AuthsController();

/** 회원가입  **/
authRouter.post('/sign-up', userCreateSchema, authsController.signUp)

/** 로그인 **/
authRouter.post('/sign-in', userLoginSchema, authsController.signIn)

export { authRouter };