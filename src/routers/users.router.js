import express from 'express';
import { UsersController } from '../controllers/users.controller.js';

const usersRouter = express.Router();

const usersController  = new UsersController();

usersRouter.get('/profile')
usersRouter.post('/token/refresh')
usersRouter.get('/logout')

export { usersRouter };