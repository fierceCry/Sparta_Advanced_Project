import express from 'express';
import { userCreateSchema } from '../middlewarmies/validation/sign-up.validation.middlware.js';
import { userLoginSchema } from '../middlewarmies/validation/sign-in.validateion.middlewar.js';
import { AuthsController } from '../controllers/auth.controller.js';
import { AuthService }from '../services/auth.service.js';
import { prisma } from '../utils/prisma.util.js';
import { UserRepository } from '../repositories/users.repository.js';

const authRouter = express.Router();

const userRepository = new UserRepository(prisma);
const authService = new AuthService(userRepository);
const authsController  = new AuthsController(authService);

/** 회원가입  **/
authRouter.post('/sign-up', userCreateSchema, authsController.signUp)

/** 로그인 **/
authRouter.post('/sign-in', userLoginSchema, authsController.signIn)

export { authRouter };