import express from 'express';
import { UserController } from '../controllers/users.controller.js';
import { authMiddleware } from '../middlewarmies/require-access-token.middleware.js';
import { refreshTokenMiddleware } from '../middlewarmies/require-refresh-token.middleware.js';
import { UserRepository } from '../repositories/users.repository.js';
import { prisma } from '../utils/prisma.util.js';
import { AuthService } from '../services/auth.service.js';

const userRouter = express.Router();

const userRepository = new UserRepository(prisma);
const authService = new AuthService(userRepository);
const userController = new UserController(authService);

/** 유저 정보 조회**/
userRouter.get('/profile', authMiddleware, userController.getProfile);

/** 토큰 재발급 **/
userRouter.post(
  '/token/refresh',
  refreshTokenMiddleware,
  userController.refreshToken
);

/** 로그아웃 **/
userRouter.get('/logout', refreshTokenMiddleware, userController.logout);

export { userRouter };
