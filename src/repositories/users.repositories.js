import { prisma } from '../utils/prisma.util.js';

export class UserRepository {
  findById = async (userId) => {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  };
  updateOrCreateToken = async (userId, refreshToken) => {
    const existingToken = await prisma.refreshToken.findFirst({
      where: { userId },
    });
    if (existingToken) {
      return await prisma.refreshToken.update({
        where: { id: existingToken.id },
        data: { refreshToken },
      });
    } else {
      return await prisma.refreshToken.create({
        data: { userId, refreshToken },
      });
    }
  };

  deleteTokenByUserId = async (userId) => {
    const existingToken = await prisma.refreshToken.findFirst({
      where: { userId },
    });
    if (existingToken) {
      await prisma.refreshToken.delete({
        where: { id: existingToken.id },
      });
      return { id: existingToken.id };
    }
    return null;
  };
}
