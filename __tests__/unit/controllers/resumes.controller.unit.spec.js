import { jest } from '@jest/globals';
import { ResumesController } from '../../../src/controllers/resumes.controller.js';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';
import { NotFoundError, ForbiddenError } from '../../../src/errors/http.error.js';

let mockResumesService = {
  createResume: jest.fn(),
  getResumes: jest.fn(),
  getResumeById: jest.fn(),
  updateResume: jest.fn(),
  deleteResume: jest.fn(),
  createResumeLog: jest.fn(),
  getResumeLogs: jest.fn(),
};

let resumesController = new ResumesController(mockResumesService);

describe('ResumesController 유닛 테스트', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      user: {},
      body: {},
      query: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test('이력서 생성 성공', async () => {
    req.user.id = 1;
    req.body = { title: 'title', content: 'content' };
    const result = { id: 1, title: 'title', content: 'content' };

    mockResumesService.createResume.mockResolvedValue(result);

    await resumesController.createResume(req, res, next);

    expect(mockResumesService.createResume).toHaveBeenCalledWith(1, req.body);
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({ data: result });
  });

  test('이력서 생성 실패', async () => {
    const error = new Error('Error creating resume');

    mockResumesService.createResume.mockRejectedValue(error);

    await resumesController.createResume(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('이력서 목록 조회 성공', async () => {
    req.user.id = 1;
    req.user.role = 'APPLICANT';
    req.query = { sortBy: 'createdAt', order: 'desc' };
    const resumes = [{ id: 1, title: 'title', content: 'content' }];

    mockResumesService.getResumes.mockResolvedValue(resumes);

    await resumesController.getResumes(req, res, next);

    expect(mockResumesService.getResumes).toHaveBeenCalledWith(1, 'APPLICANT', req.query);
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({ data: resumes });
  });

  test('이력서 목록 조회 실패', async () => {
    const error = new Error('Error getting resumes');

    mockResumesService.getResumes.mockRejectedValue(error);

    await resumesController.getResumes(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('이력서 상세 조회 성공', async () => {
    req.user.id = 1;
    req.user.role = 'APPLICANT';
    req.params.resumeId = 1;
    const resume = { id: 1, title: 'title', content: 'content' };

    mockResumesService.getResumeById.mockResolvedValue(resume);

    await resumesController.getResumeById(req, res, next);

    expect(mockResumesService.getResumeById).toHaveBeenCalledWith(1, 'APPLICANT', 1);
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({ data: resume });
  });

  test('이력서 상세 조회 실패 - 없는 이력서', async () => {
    const error = new NotFoundError('Resume not found');

    mockResumesService.getResumeById.mockRejectedValue(error);

    await resumesController.getResumeById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('이력서 업데이트 성공', async () => {
    req.user.id = 1;
    req.body = { title: 'new title', content: 'new content' };
    req.params.resumeId = 1;
    const updatedResume = { id: 1, title: 'new title', content: 'new content' };

    mockResumesService.updateResume.mockResolvedValue(updatedResume);

    await resumesController.updateResume(req, res, next);

    expect(mockResumesService.updateResume).toHaveBeenCalledWith(1, 1, 'new title', 'new content');
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({ data: updatedResume });
  });

  test('이력서 업데이트 실패 - 없는 이력서', async () => {
    const error = new NotFoundError('Resume not found');

    mockResumesService.updateResume.mockRejectedValue(error);

    await resumesController.updateResume(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('이력서 삭제 성공', async () => {
    req.user.id = 1;
    req.params.resumeId = 1;
    const deletedResumeId = { id: 1 };

    mockResumesService.deleteResume.mockResolvedValue(deletedResumeId);

    await resumesController.deleteResume(req, res, next);

    expect(mockResumesService.deleteResume).toHaveBeenCalledWith(1, 1);
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({ data: deletedResumeId });
  });

  test('이력서 삭제 실패 - 없는 이력서', async () => {
    const error = new NotFoundError('Resume not found');

    mockResumesService.deleteResume.mockRejectedValue(error);

    await resumesController.deleteResume(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('이력서 로그 생성 성공', async () => {
    req.user.id = 1;
    req.body = { resumeStatus: 'PENDING', reason: 'reason' };
    req.params.resumeId = 1;
    const result = { id: 1, resumeId: 1, status: 'PENDING', reason: 'reason' };

    mockResumesService.createResumeLog.mockResolvedValue(result);

    await resumesController.createResumeLog(req, res, next);

    expect(mockResumesService.createResumeLog).toHaveBeenCalledWith(1, 1, req.body);
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({ data: result });
  });

  test('이력서 로그 생성 실패', async () => {
    const error = new Error('Error creating resume log');

    mockResumesService.createResumeLog.mockRejectedValue(error);

    await resumesController.createResumeLog(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('이력서 로그 조회 성공', async () => {
    req.params.resumeId = 1;
    const logs = [{ id: 1, resumeId: 1, status: 'PENDING', reason: 'reason' }];

    mockResumesService.getResumeLogs.mockResolvedValue(logs);

    await resumesController.getResumeLogs(req, res, next);

    expect(mockResumesService.getResumeLogs).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({ data: logs });
  });

  test('이력서 로그 조회 실패', async () => {
    const error = new Error('Error getting resume logs');

    mockResumesService.getResumeLogs.mockRejectedValue(error);

    await resumesController.getResumeLogs(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
