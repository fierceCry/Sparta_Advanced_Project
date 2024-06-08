import { ResumesRepository } from '../repositories/resume.repositories.js';
import { NotFoundError, ForbiddenError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

export class ResumesService {
  constructor() {
    this.resumesRepository = new ResumesRepository();
  }

  createResume = async (userId, resumeData) => {
    return await this.resumesRepository.createResume(userId, resumeData);
  };

  getResumes = async (userId, role, query) => {
    let { sortBy = 'createdAt', order = 'desc', status } = query;
    order = order === 'asc' ? 'asc' : 'desc';

    const whereClause = role === 'RECRUITER' ? {} : { userId };
    if (status) {
      whereClause.applyStatus = status;
    }

    const resumes = await this.resumesRepository.findResumes(whereClause, sortBy, order);
    return resumes.map(item => ({
      id: item.id,
      nickname: item.user.nickname,
      title: item.title,
      content: item.content,
      applyStatus: item.applyStatus,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  };

  getResumeById = async (userId, role, resumeId) => {
    const resume = await this.resumesRepository.findResumeById(resumeId);
    if (!resume) {
      throw new NotFoundError(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }
    if (role === 'APPLICANT' && resume.userId !== userId) {
      throw new ForbiddenError(MESSAGES.AUTH.COMMON.FORBIDDEN);
    }
    return resume;
  };

  updateResume = async (userId, resumeId, title, content) => {
    const existingResume = await this.resumesRepository.findResumeByUserIdAndId(userId, resumeId);
    if (!existingResume) {
      throw new NotFoundError(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }
    return await this.resumesRepository.updateResume(existingResume.id, title, content);
  };

  deleteResume = async (userId, resumeId) => {
    const existingResume = await this.resumesRepository.findResumeByUserIdAndId(userId, resumeId);
    if (!existingResume) {
      throw new NotFoundError(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }
    return await this.resumesRepository.deleteResume(existingResume.id);
  };

  createResumeLog = async (userId, resumeId, data) => {
    return await this.resumesRepository.createResumeLog(userId, resumeId, data);
  };

  getResumeLogs = async (resumeId) => {
    return await this.resumesRepository.findResumeLogs(resumeId);
  };
}
