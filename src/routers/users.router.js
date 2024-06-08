import express from 'express';
import { UserController } from '../controllers/users.controller.js';
import { authMiddleware } from '../middlewarmies/require-access-token.middleware.js';
import { refreshTokenMiddleware } from '../middlewarmies/require-refresh-token.middleware.js';

const userRouter = express.Router();

const userController = new UserController();

userRouter.get('/profile', authMiddleware, userController.getProfile);
userRouter.post('/token/refresh', refreshTokenMiddleware, userController.refreshToken);
userRouter.get('/logout', refreshTokenMiddleware, userController.logout);

export { userRouter };
