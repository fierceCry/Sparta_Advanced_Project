import { jest } from '@jest/globals';
import { ResumesRepository } from '../../../src/repositories/resume.repository.js';

// Prisma 클라이언트에서는 아래 5개의 메서드만 사용합니다.
let mockPrisma = {
  resume: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
  resumeLog: {
    create: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
};

let resumesRepository = new ResumesRepository(mockPrisma);

describe('Resumes Repository Unit 테스트', () => {

  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.clearAllMocks(); // 모든 Mock을 초기화합니다.
  })

  test('이력서 생성 메서드', async () => {
    const userId = 1;
    const resumeData = {
      title: 'Test Resume',
      content: 'This is a test resume content',
    };
    const expectedCreatedResume = { id: 1, ...resumeData };

    mockPrisma.resume.create.mockResolvedValue(expectedCreatedResume);

    const createdResume = await resumesRepository.createResume(userId, resumeData);

    expect(createdResume).toEqual(expectedCreatedResume);
    expect(mockPrisma.resume.create).toHaveBeenCalledWith({
      data: {
        userId: userId,
        title: resumeData.title,
        content: resumeData.content,
      },
    });
  });

  test('이력서 조회 메서드', async () => {
    const whereClause = { userId: 1 };
    const sortBy = 'createdAt';
    const order = 'desc';
    const expectedResumes = [{ id: 1, title: 'Test Resume', content: 'Test content' }];

    mockPrisma.resume.findMany.mockResolvedValue(expectedResumes);

    const resumes = await resumesRepository.findResumes(whereClause, sortBy, order);

    expect(resumes).toEqual(expectedResumes);
    expect(mockPrisma.resume.findMany).toHaveBeenCalledWith({
      where: whereClause,
      orderBy: { [sortBy]: order },
      select: expect.any(Object),
    });
  });

  test('이력서 상세조회 메서드', async () => {
    const resumeId = 1;
    const expectedResume = { id: 1, title: 'Test Resume', content: 'Test content' };

    mockPrisma.resume.findFirst.mockResolvedValue(expectedResume);

    const resume = await resumesRepository.findResumeById(resumeId);

    expect(resume).toEqual(expectedResume);
    expect(mockPrisma.resume.findFirst).toHaveBeenCalledWith({
      where: { id: resumeId },
    });
  });

  test('이력서 사용자 및 ID로 조회 메서드', async () => {
    const userId = 1;
    const resumeId = 1;
    const expectedResume = { id: 1, title: 'Test Resume', content: 'Test content' };

    mockPrisma.resume.findFirst.mockResolvedValue(expectedResume);

    const resume = await resumesRepository.findResumeByUserIdAndId(userId, resumeId);

    expect(resume).toEqual(expectedResume);
    expect(mockPrisma.resume.findFirst).toHaveBeenCalledWith({
      where: { id: resumeId, userId: userId },
    });
  });

  test('이력서 업데이트 메서드', async () => {
    const resumeId = 1;
    const title = 'Updated Resume Title';
    const content = 'Updated resume content';
    const expectedUpdatedResume = { id: 1, title: title, content: content };

    mockPrisma.resume.update.mockResolvedValue(expectedUpdatedResume);

    const updatedResume = await resumesRepository.updateResume(resumeId, title, content);

    expect(updatedResume).toEqual(expectedUpdatedResume);
    expect(mockPrisma.resume.update).toHaveBeenCalledWith({
      where: { id: resumeId },
      data: { title: title, content: content },
    });
  });

  test('이력서 삭제 메서드', async () => {
    const resumeId = 1;
    const expectedDeletedResume = { id: 1, title: 'Test Resume', content: 'Test content' };

    mockPrisma.$transaction.mockResolvedValue(expectedDeletedResume);

    const deletedResume = await resumesRepository.deleteResume(resumeId);

    expect(deletedResume).toEqual(expectedDeletedResume);
    expect(mockPrisma.$transaction).toHaveBeenCalledWith(expect.any(Function));
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
  });

  test('이력서 로그 생성 메서드', async () => {
    const userId = 1;
    const resumeId = 1;
    const data = {
      resumeStatus: 'In Review',
      reason: 'Waiting for further review',
    };
    const expectedResume = { id: resumeId, applyStatus: data.resumeStatus };
    const expectedRecruiter = { id: userId };
    const expectedCreatedResumeLog = {
      id: 1,
      resumeId: resumeId,
      oldApplyStatus: expectedResume.applyStatus,
      newApplyStatus: data.resumeStatus,
      reason: data.reason,
      createdAt: new Date(),
      recruiter: { nickname: 'Test Recruiter' },
    };

    mockPrisma.resume.findFirst.mockResolvedValue(expectedResume);
    mockPrisma.user.findUnique.mockResolvedValue(expectedRecruiter);
    mockPrisma.$transaction.mockResolvedValue(expectedCreatedResumeLog);

    const createdResumeLog = await resumesRepository.createResumeLog(userId, resumeId, data);

    expect(createdResumeLog).toEqual(expectedCreatedResumeLog);
    expect(mockPrisma.resume.findFirst).toHaveBeenCalledWith({
      where: { id: resumeId },
    });
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
  });

  test('이력서 로그 조회 메서드', async () => {
    const resumeId = 1;
    const expectedLogs = [
      {
        id: 1,
        resumeId: resumeId,
        oldApplyStatus: 'In Review',
        newApplyStatus: 'Accepted',
        reason: 'Good qualifications',
        createdAt: new Date(),
        recruiter: { nickname: 'Test Recruiter' },
      },
    ];

    mockPrisma.resumeLog.findMany.mockResolvedValue(expectedLogs);

    const logs = await resumesRepository.findResumeLogs(resumeId);

    expect(logs).toEqual(expectedLogs);
    expect(mockPrisma.resumeLog.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      where: { resumeId: resumeId },
      select: expect.any(Object),
    });
  });
});
