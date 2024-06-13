import express from 'express';
import { ResumesController } from '../controllers/resumes.controller.js';
import { authMiddleware } from '../middlewarmies/require-access-token.middleware.js';
import { resumerCreatesSchema } from '../middlewarmies/validation/resumeCreate.validation.middleware.js';
import { resumerUpdateSchema } from '../middlewarmies/validation/resumeUpdate.validation.middleware.js';
import {resumerLogSchema } from '../middlewarmies/validation/resumeLogCreate.validation.middleware.js';
import { requireRoles } from '../middlewarmies/require-roles.middleware.js';
import { USER_ROLE } from '../constants/user.constant.js';
import { ResumesService } from '../services/resume.service.js';
import { ResumesRepository } from '../repositories/resume.repository.js';
import { prisma } from '../utils/prisma.util.js';
const resumeRouter = express.Router();

const resumesRepository = new ResumesRepository(prisma);
const resumesService = new ResumesService(resumesRepository);
const resumesController  = new ResumesController(resumesService);

/** 이력서 생성 API **/
resumeRouter.post('/', authMiddleware, resumerCreatesSchema, resumesController.createResume);

/** 이력서 목록 조회 API **/
resumeRouter.get('/list', authMiddleware, resumesController.getResumes);

/** 이력서 상세 조회 API **/
resumeRouter.get('/:resumeId', authMiddleware, resumesController.getResumeById);

/** 이력서 수정 API **/
resumeRouter.patch('/:resumeId', authMiddleware, resumerUpdateSchema, resumesController.updateResume);

/** 이력서 삭제 API **/
resumeRouter.delete('/:resumeId', authMiddleware, resumesController.deleteResume);

/** 이력서 지원자 이력서 수정 & 로그 생성 API **/
resumeRouter.patch('/:resumeId/logs', authMiddleware, resumerLogSchema, requireRoles(['RECRUITER']), resumesController.createResumeLog);

/** 이력서 로그 상세 조회 API **/
resumeRouter.get('/:resumeId/logs', authMiddleware, requireRoles([USER_ROLE.RECRUITER]), resumesController.getResumeLogs);

export { resumeRouter };