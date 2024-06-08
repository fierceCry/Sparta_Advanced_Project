import express from 'express';
import { authRouter } from './auth.router.js';
import { userRouter } from './users.router.js';
import { resumeRouter } from './resume.router.js';

const route = express.Router();

route.use('/auth', authRouter);
route.use('/resumes', resumeRouter)
route.use('/users', userRouter);

export { route };