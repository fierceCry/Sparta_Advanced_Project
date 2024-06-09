// import { prisma } from '../utils/prisma.util.js';

export class ResumesRepository {
  constructor(prisma){
    this.prisma = prisma;
  }
  createResume = async (userId, resumeData) => {
    return await this.prisma.resume.create({
      data: {
        userId: userId,
        title: resumeData.title,
        content: resumeData.content,
      },
    });
  };

  findResumes = async (whereClause, sortBy, order) => {
    return await this.prisma.resume.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: order,
      },
      select: {
        id: true,
        user: { select: { nickname: true } },
        title: true,
        content: true,
        applyStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  };

  findResumeById = async (resumeId) => {
    return await this.prisma.resume.findFirst({
      where: { id: +resumeId },
    });
  }

  findResumeByUserIdAndId = async (userId, resumeId) => {
    return await this.prisma.resume.findFirst({
      where: {
        id: +resumeId,
        userId: userId,
      },
    });
  };

  updateResume = async (resumeId, title, content) => {
    return await this.prisma.resume.update({
      where: {
        id: +resumeId,
      },
      data: {
        ...(title && { title: title }),
        ...(content && { content: content }),
      },
    });
  };

  deleteResume = async (resumeId) => {
    return await this.prisma.$transaction(async (tx) => {
      await tx.resumeLog.deleteMany({
        where: {
          resumeId: +resumeId,
        },
      });

      return await tx.resume.delete({
        where: {
          id: +resumeId,
        },
      });
    });
  };

  createResumeLog = async (userId, resumeId, data) => {
    const resume = await this.findResumeById(resumeId);
    const recruiter = await this.prisma.user.findUnique({ where: { id: userId } });

    return await this.prisma.$transaction(async (tx) => {
      await this.tx.resume.update({
        where: { id: +resumeId },
        data: { applyStatus: data.resumeStatus },
      });

      return await this.tx.resumeLog.create({
        data: {
          resume: { connect: { id: +resumeId } },
          recruiter: { connect: { id: recruiter.id } },
          oldApplyStatus: resume.applyStatus,
          newApplyStatus: data.resumeStatus,
          reason: data.reason,
        },
      });
    });
  };

  findResumeLogs = async (resumeId) => {
    return await this.prisma.resumeLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        resumeId: +resumeId,
      },
      select: {
        id: true,
        resumeId: true,
        oldApplyStatus: true,
        newApplyStatus: true,
        reason: true,
        createdAt: true,
        recruiter: {
          select: {
            nickname: true,
          },
        },
      },
    });
  };
}
