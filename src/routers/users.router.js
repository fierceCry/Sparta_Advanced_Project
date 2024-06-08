import express from 'express';
import { UserController } from '../controllers/users.controller.js';
import { authMiddleware } from '../middlewarmies/require-access-token.middleware.js';
import { refreshTokenMiddleware } from '../middlewarmies/require-refresh-token.middleware.js';

const userRouter = express.Router();

const userController = new UserController();

/** 유저 정보 조회**/
userRouter.get('/profile', authMiddleware, userController.getProfile);

/** 토큰 재발급 **/
userRouter.post('/token/refresh', refreshTokenMiddleware, userController.refreshToken);

/** 로그아웃 **/
userRouter.get('/logout', refreshTokenMiddleware, userController.logout);

export { userRouter };
