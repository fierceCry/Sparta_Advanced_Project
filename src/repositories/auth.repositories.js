import { prisma } from '../utils/prisma.util.js';

export class AuthRepositores {
  findOne = async (email) => {
    const result = await prisma.user.findFirst({ where: { email } });
    return result;
  };

  userCreate = async (email, hashPassword, nickname) => {
    return await prisma.user.create({
      data: {
        email: email,
        password: hashPassword,
        nickname: nickname,
      },
    });
  };

  token = async (id, refreshToken) => {
    return await prisma.refreshToken.upsert({
      where: { userId: id },
      update: { refreshToken: refreshToken },
      create: { userId: id, refreshToken: refreshToken },
    });
  };
}
