import express from 'express';
import { ResumesController } from '../controllers/resumes.controller.js';

const resumeRouter = express.Router();

const resumesController  = new ResumesController();

resumeRouter.get('/', resumesController.resumeGet)
resumeRouter.post('/', resumesController.resumePost)
resumeRouter.get('/:resumId')
resumeRouter.patch('/:resumeId')
resumeRouter.delete('/resumeId')
resumeRouter.patch('/:resumeId/logs')
resumeRouter.get('resumeId/status')

export { resumeRouter };