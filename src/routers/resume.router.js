import express from 'express';
import { ResumesController } from '../controllers/resumes.controller.js';
import { authMiddleware } from '../middlewarmies/require-access-token.middleware.js';
import { resumerCreatesSchema } from '../middlewarmies/validation/resumeCreate.validation.middleware.js';
import { resumerUpdateSchema } from '../middlewarmies/validation/resumeUpdate.validation.middleware.js';
import {resumerLogSchema } from '../middlewarmies/validation/resumeLogCreate.validation.middleware.js';
import { requireRoles } from '../middlewarmies/require-roles.middleware.js';

const resumeRouter = express.Router();

const resumesController  = new ResumesController();

/** 이력서 생성 API **/
resumeRouter.post('/', authMiddleware, resumerCreatesSchema, resumesController.createResume);

/** 이력서 목록 조회 API **/
resumeRouter.get('/', authMiddleware, resumesController.getResumes);

/** 이력서 상세 조회 API **/
resumeRouter.get('/:resumeId', authMiddleware, resumesController.getResumeById);

/** 이력서 수정 API **/
resumeRouter.patch('/:resumeId', authMiddleware, resumerUpdateSchema, resumesController.updateResume);

/** 이력서 삭제 API **/
resumeRouter.delete('/:resumeId', authMiddleware, resumesController.deleteResume);

/** 이력서 지원자 이력서 수정 & 로그 생성 API **/
resumeRouter.patch('/:resumeId/logs', authMiddleware, resumerLogSchema, requireRoles(['RECRUITER']), resumesController.createResumeLog);

/** 이력서 로그 상세 조회 API **/
resumeRouter.get('/:resumeId/status', authMiddleware, requireRoles(['RECRUITER']), resumesController.getResumeLogs);


export { resumeRouter };