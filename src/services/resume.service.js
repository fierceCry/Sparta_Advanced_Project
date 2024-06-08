import { ResumesRepository } from '../repositories/resume.repositories.js';

export class ResumesService {
  constructor() {
    this.resumesRepository = new ResumesRepository();
  }

  createResume = async (userId, resumerData) => {
    return await this.resumesRepository.createResume(userId, resumerData);
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
      throw new Error('이력서가 존재하지 않습니다.');
    }
    if (role === 'APPLICANT' && resume.userId !== userId) {
      throw new Error('접근이 거부되었습니다.');
    }
    return resume;
  };

  updateResume = async (userId, resumeId, data) => {
    const existingResume = await this.resumesRepository.findResumeByUserIdAndId(userId, resumeId);
    if (!existingResume) {
      throw new Error('이력서가 존재하지 않습니다.');
    }
    return await this.resumesRepository.updateResume(existingResume.id, data);
  };

  deleteResume = async (userId, resumeId) => {
    const existingResume = await this.resumesRepository.findResumeByUserIdAndId(userId, resumeId);
    if (!existingResume) {
      throw new Error('이력서가 존재하지 않습니다.');
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
