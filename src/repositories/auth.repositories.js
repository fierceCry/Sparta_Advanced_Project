import { prisma } from '../utils/prisma.util.js';

export class AuthRepositores {
  findOne = async (email) => {
    const result = await prisma.user.findFirst({ where: { email } });
    return result
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
}
