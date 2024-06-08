import { prisma } from '../utils/prisma.util.js'

export class ResumesRepository{

  findAllResume = async(whereClause, sortBy, order) =>{
    return prisma.resume.findMany({
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
  }

}