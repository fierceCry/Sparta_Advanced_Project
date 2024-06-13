export class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  findById = async (userId) => {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  };

  updateOrCreateToken = async (userId, refreshToken) => {
    const existingToken = await this.prisma.refreshToken.findFirst({
      where: { userId },
    });
    if (existingToken) {
      return await this.prisma.refreshToken.update({
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
    const existingToken = await this.prisma.refreshToken.findFirst({
      where: { userId },
    });
    if (existingToken) {
      await this.prisma.refreshToken.delete({
        where: { id: existingToken.id },
      });
      return { id: existingToken.id };
    }
    return null;
  };

  findOne = async (email) => {
    const result = await this.prisma.user.findFirst({ where: { email } });
    return result;
  };

  userCreate = async (email, hashPassword, nickname) => {
    return await this.prisma.user.create({
      data: {
        email: email,
        password: hashPassword,
        nickname: nickname,
      },
    });
  };

  token = async (id, refreshToken) => {
    return await this.prisma.refreshToken.upsert({
      where: { userId: id },
      update: { refreshToken: refreshToken },
      create: { userId: id, refreshToken: refreshToken },
    });
  };

  findByToken = async (id)=>{
    return await this.prisma.refreshToken.findUnique({
      where:{ userId: id}
    })
  }
}
