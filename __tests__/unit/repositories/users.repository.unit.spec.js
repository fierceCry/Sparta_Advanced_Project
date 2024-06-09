import { jest } from '@jest/globals';
import { UserRepository } from '../../../src/repositories/users.repository.js';

// Prisma 클라이언트에서는 아래 메서드들을 사용합니다.
let mockPrisma = {
  user: {
    findUnique: jest.fn(),
  },
  refreshToken: {
    findFirst: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
};
 
let userRepository = new UserRepository(mockPrisma);

describe('User Repository Unit Test', () => {

  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.clearAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('사용자 ID로 찾기 메서드', async () => {
    const userId = 1;
    const expectedUser = { id: userId, email: 'test@example.com' };

    mockPrisma.user.findUnique.mockResolvedValue(expectedUser);

    const user = await userRepository.findById(userId);

    expect(user).toEqual(expectedUser);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });
  });

  test('토큰 업데이트 또는 생성 메서드 - 기존 토큰 업데이트', async () => {
    const userId = 1;
    const refreshToken = 'newRefreshToken';
    const existingToken = { id: 1, userId: userId, refreshToken: 'oldRefreshToken' };
    const updatedToken = { id: 1, userId: userId, refreshToken: refreshToken };

    mockPrisma.refreshToken.findFirst.mockResolvedValue(existingToken);
    mockPrisma.refreshToken.update.mockResolvedValue(updatedToken);

    const token = await userRepository.updateOrCreateToken(userId, refreshToken);

    expect(token).toEqual(updatedToken);
    expect(mockPrisma.refreshToken.findFirst).toHaveBeenCalledWith({
      where: { userId },
    });
    expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith({
      where: { id: existingToken.id },
      data: { refreshToken },
    });
  });

  // test('토큰 업데이트 또는 생성 메서드 - 새로운 토큰 생성', async () => {
  //   const userId = 1;
  //   const refreshToken = 'newRefreshToken';
  //   const createdToken = { id: 1, userId: userId, refreshToken: refreshToken };

  //   mockPrisma.refreshToken.findFirst.mockResolvedValue(null);
  //   mockPrisma.refreshToken.create.mockResolvedValue(createdToken);

  //   const token = await userRepository.updateOrCreateToken(userId, refreshToken);

  //   expect(token).toEqual(createdToken);
  //   expect(mockPrisma.refreshToken.findFirst).toHaveBeenCalledWith({
  //     where: { userId },
  //   });
  //   expect(mockPrisma.refreshToken.create).toHaveBeenCalledWith({
  //     data: { userId, refreshToken },
  //   });
  // });

  test('사용자 ID로 토큰 삭제 메서드 - 토큰이 존재하는 경우', async () => {
    const userId = 1;
    const existingToken = { id: 1, userId: userId, refreshToken: 'oldRefreshToken' };

    mockPrisma.refreshToken.findFirst.mockResolvedValue(existingToken);
    mockPrisma.refreshToken.delete.mockResolvedValue({ id: existingToken.id });

    const result = await userRepository.deleteTokenByUserId(userId);

    expect(result).toEqual({ id: existingToken.id });
    expect(mockPrisma.refreshToken.findFirst).toHaveBeenCalledWith({
      where: { userId },
    });
    expect(mockPrisma.refreshToken.delete).toHaveBeenCalledWith({
      where: { id: existingToken.id },
    });
  });

  test('사용자 ID로 토큰 삭제 메서드 - 토큰이 존재하지 않는 경우', async () => {
    const userId = 1;

    mockPrisma.refreshToken.findFirst.mockResolvedValue(null);

    const result = await userRepository.deleteTokenByUserId(userId);

    expect(result).toBeNull();
    expect(mockPrisma.refreshToken.findFirst).toHaveBeenCalledWith({
      where: { userId },
    });
    expect(mockPrisma.refreshToken.delete).not.toHaveBeenCalled();
  });

});
