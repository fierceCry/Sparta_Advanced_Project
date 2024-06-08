import { ResumesRepository } from '../repositories/resume.repositories.js';
export class ResumesService {
  resumesRepository = new ResumesRepository();
  findAllResume = async (id, role, query) => {
    let { sortBy = 'createdAt', order = 'desc', status } = query;

    // 기본적으로 'desc'로 설정
    order = order === 'asc' ? 'asc' : 'desc';

    // whereClause 설정
    const whereClause = role === 'RECRUITER' ? {} : { userId: id };
    if (status) {
      whereClause.applyStatus = status;
    }

    const data = await resumesRepository.findAllResume(whereClause, sortBy, order);

    return data.map((item) => ({
      id: item.id,
      nickname: item.user.nickname,
      title: item.title,
      content: item.content,
      applyStatus: item.applyStatus,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  };
  createResume = async (id, title, content) => {
    const resume = await this.resumesRepository.createResume(id, title, content);

    return resume
  };
}
