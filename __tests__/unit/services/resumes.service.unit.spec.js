import { jest } from '@jest/globals';
import { ResumesService } from '../../../src/services/resume.service.js';
import { NotFoundError, ForbiddenError } from '../../../src/errors/http.error.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';

let mockResumesRepository = {
  createResume: jest.fn(),
  findResumes: jest.fn(),
  findResumeById: jest.fn(),
  findResumeByUserIdAndId: jest.fn(),
  updateResume: jest.fn(),
  deleteResume: jest.fn(),
  createResumeLog: jest.fn(),
  findResumeLogs: jest.fn(),
};

let resumesService = new ResumesService(mockResumesRepository);

describe('ResumesService Unit Test', () => {

  beforeEach(() => {
    jest.clearAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('이력서 생성 메서드 - 성공', async () => {
    const userId = 1;
    const resumeData = { title: 'Sample Title', content: 'Sample Content' };
    const createdResume = { id: 1, ...resumeData, userId };

    mockResumesRepository.createResume.mockResolvedValue(createdResume);

    const result = await resumesService.createResume(userId, resumeData);

    expect(result).toEqual(createdResume);
    expect(mockResumesRepository.createResume).toHaveBeenCalledWith(userId, resumeData);
  });

  test('이력서 조회 메서드 - 성공', async () => {
    const userId = 1;
    const role = 'APPLICANT';
    const query = { sortBy: 'createdAt', order: 'desc', status: 'PENDING' };
    const resumes = [
      {
        id: 1, user: { nickname: 'testuser' }, title: 'Sample Title',
        content: 'Sample Content', applyStatus: 'PENDING',
        createdAt: new Date(), updatedAt: new Date()
      }
    ];

    mockResumesRepository.findResumes.mockResolvedValue(resumes);

    const result = await resumesService.getResumes(userId, role, query);

    expect(result).toEqual([
      {
        id: 1, nickname: 'testuser', title: 'Sample Title', content: 'Sample Content',
        applyStatus: 'PENDING', createdAt: resumes[0].createdAt, updatedAt: resumes[0].updatedAt
      }
    ]);
    expect(mockResumesRepository.findResumes).toHaveBeenCalledWith({ userId, applyStatus: 'PENDING' }, 'createdAt', 'desc');
  });

  test('이력서 상세 조회 메서드 - 성공', async () => {
    const userId = 1;
    const role = 'APPLICANT';
    const resumeId = 1;
    const resume = { id: resumeId, userId, title: 'Sample Title', content: 'Sample Content' };

    mockResumesRepository.findResumeById.mockResolvedValue(resume);

    const result = await resumesService.getResumeById(userId, role, resumeId);

    expect(result).toEqual(resume);
    expect(mockResumesRepository.findResumeById).toHaveBeenCalledWith(resumeId);
  });

  test('이력서 상세 조회 메서드 - 찾을 수 없음', async () => {
    const userId = 1;
    const role = 'APPLICANT';
    const resumeId = 1;

    mockResumesRepository.findResumeById.mockResolvedValue(null);

    await expect(resumesService.getResumeById(userId, role, resumeId)).rejects.toThrow(NotFoundError);
    await expect(resumesService.getResumeById(userId, role, resumeId)).rejects.toThrow(MESSAGES.RESUMES.COMMON.NOT_FOUND);
  });

  test('이력서 업데이트 메서드 - 성공', async () => {
    const userId = 1;
    const resumeId = 1;
    const title = 'Updated Title';
    const content = 'Updated Content';
    const existingResume = { id: resumeId, userId, title: 'Sample Title', content: 'Sample Content' };
    const updatedResume = { id: resumeId, userId, title, content };

    mockResumesRepository.findResumeByUserIdAndId.mockResolvedValue(existingResume);
    mockResumesRepository.updateResume.mockResolvedValue(updatedResume);

    const result = await resumesService.updateResume(userId, resumeId, title, content);

    expect(result).toEqual(updatedResume);
    expect(mockResumesRepository.findResumeByUserIdAndId).toHaveBeenCalledWith(userId, resumeId);
    expect(mockResumesRepository.updateResume).toHaveBeenCalledWith(resumeId, title, content);
  });

  test('이력서 업데이트 메서드 - 찾을 수 없음', async () => {
    const userId = 1;
    const resumeId = 1;
    const title = 'Updated Title';
    const content = 'Updated Content';

    mockResumesRepository.findResumeByUserIdAndId.mockResolvedValue(null);

    await expect(resumesService.updateResume(userId, resumeId, title, content)).rejects.toThrow(NotFoundError);
    await expect(resumesService.updateResume(userId, resumeId, title, content)).rejects.toThrow(MESSAGES.RESUMES.COMMON.NOT_FOUND);
  });

  test('이력서 삭제 메서드 - 성공', async () => {
    const userId = 1;
    const resumeId = 1;
    const existingResume = { id: resumeId, userId, title: 'Sample Title', content: 'Sample Content' };

    mockResumesRepository.findResumeByUserIdAndId.mockResolvedValue(existingResume);
    mockResumesRepository.deleteResume.mockResolvedValue(true);

    const result = await resumesService.deleteResume(userId, resumeId);

    expect(result).toBe(true);
    expect(mockResumesRepository.findResumeByUserIdAndId).toHaveBeenCalledWith(userId, resumeId);
    expect(mockResumesRepository.deleteResume).toHaveBeenCalledWith(resumeId);
  });

  test('이력서 삭제 메서드 - 찾을 수 없음', async () => {
    const userId = 1;
    const resumeId = 1;

    mockResumesRepository.findResumeByUserIdAndId.mockResolvedValue(null);

    await expect(resumesService.deleteResume(userId, resumeId)).rejects.toThrow(NotFoundError);
    await expect(resumesService.deleteResume(userId, resumeId)).rejects.toThrow(MESSAGES.RESUMES.COMMON.NOT_FOUND);
  });

  test('이력서 로그 생성 메서드 - 성공', async () => {
    const userId = 1;
    const resumeId = 1;
    const data = { resumeStatus: 'APPROVED', reason: 'Qualified' };
    const createdResumeLog = { id: 1, resumeId, recruiterId: userId, oldApplyStatus: 'PENDING', newApplyStatus: data.resumeStatus, reason: data.reason };

    mockResumesRepository.createResumeLog.mockResolvedValue(createdResumeLog);

    const result = await resumesService.createResumeLog(userId, resumeId, data);

    expect(result).toEqual(createdResumeLog);
    expect(mockResumesRepository.createResumeLog).toHaveBeenCalledWith(userId, resumeId, data);
  });

  test('이력서 로그 조회 메서드 - 성공', async () => {
    const resumeId = 1;
    const resumeLogs = [
      { id: 1, resumeId, oldApplyStatus: 'PENDING', newApplyStatus: 'APPROVED', reason: 'Qualified', createdAt: new Date(), recruiter: { nickname: 'recruiter1' } }
    ];

    mockResumesRepository.findResumeLogs.mockResolvedValue(resumeLogs);

    const result = await resumesService.getResumeLogs(resumeId);

    expect(result).toEqual(resumeLogs);
    expect(mockResumesRepository.findResumeLogs).toHaveBeenCalledWith(resumeId);
  });
});
