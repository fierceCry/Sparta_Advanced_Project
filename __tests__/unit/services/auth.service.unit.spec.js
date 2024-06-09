import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthService } from '../../../src/services/auth.service.js';
import { BadRequestError, UnauthorizedError } from '../../../src/errors/http.error.js';
import { ENV_KEY } from '../../../src/constants/env.constant.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';
import { HASH_SALT_ROUNDS, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../../../src/constants/auth.constant.js';

let mockUserRepository = {
  findOne: jest.fn(),
  userCreate: jest.fn(),
  token: jest.fn(),
};

let authService = new AuthService(mockUserRepository);

describe('AuthService Unit Test', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('가입 메서드 - 성공', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const nickname = 'testuser';
    const hashedPassword = 'hashedPassword123';
    const userCreateResult = { id: 1, email, nickname };

    mockUserRepository.findOne.mockResolvedValue(null);
    mockUserRepository.userCreate.mockResolvedValue(userCreateResult);
    bcrypt.hashSync = jest.fn().mockReturnValue(hashedPassword);

    const result = await authService.signUp(email, password, nickname);

    expect(result).toEqual(userCreateResult);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith(email);
    expect(bcrypt.hashSync).toHaveBeenCalledWith(password, HASH_SALT_ROUNDS);
    expect(mockUserRepository.userCreate).toHaveBeenCalledWith(email, hashedPassword, nickname);
  });

  test('가입 메서드 - 이메일 중복', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const nickname = 'testuser';
    const existingUser = { id: 1, email, nickname };

    mockUserRepository.findOne.mockResolvedValue(existingUser);

    await expect(authService.signUp(email, password, nickname)).rejects.toThrow(BadRequestError);
    await expect(authService.signUp(email, password, nickname)).rejects.toThrow(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
  });

  test('로그인 메서드 - 성공', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const userId = 1;
    const userData = { id: userId, email, password: 'hashedPassword' };
    const accessToken = 'accessToken123';
    const refreshToken = 'refreshToken123';
    const hashedRefreshToken = 'hashedRefreshToken123';

    mockUserRepository.findOne.mockResolvedValue(userData);
    bcrypt.compareSync = jest.fn().mockReturnValue(true);
    authService.generateTokens = jest.fn().mockReturnValue({ accessToken, refreshToken });
    bcrypt.hashSync = jest.fn().mockReturnValue(hashedRefreshToken);
    mockUserRepository.token.mockResolvedValue(true);

    const result = await authService.signIn(email, password);

    expect(result).toEqual({ accessToken, refreshToken });
    expect(mockUserRepository.findOne).toHaveBeenCalledWith(email);
    expect(bcrypt.compareSync).toHaveBeenCalledWith(password, userData.password);
    expect(authService.generateTokens).toHaveBeenCalledWith(userId);
    expect(bcrypt.hashSync).toHaveBeenCalledWith(refreshToken, HASH_SALT_ROUNDS);
    expect(mockUserRepository.token).toHaveBeenCalledWith(userId, hashedRefreshToken);
  });

  test('로그인 메서드 - 잘못된 사용자', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(authService.signIn(email, password)).rejects.toThrow(UnauthorizedError);
    await expect(authService.signIn(email, password)).rejects.toThrow(MESSAGES.AUTH.COMMON.EMAIL.INVALID_USER);
  });

  test('로그인 메서드 - 권한 없음', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const userData = { id: 1, email, password: 'hashedPassword' };

    mockUserRepository.findOne.mockResolvedValue(userData);
    bcrypt.compareSync = jest.fn().mockReturnValue(false);

    await expect(authService.signIn(email, password)).rejects.toThrow(UnauthorizedError);
    await expect(authService.signIn(email, password)).rejects.toThrow(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
  });

  // test('토큰 생성 메서드', async() => {
  //   const userId = 1;
  //   const accessToken = 'accessToken123';
  //   const refreshToken = 'refreshToken123';

  //   jwt.sign = jest.fn()
  //     .mockReturnValueOnce(accessToken)
  //     .mockReturnValueOnce(refreshToken);

  //   const result = authService.generateTokens(userId);

  //   expect(result).toEqual({ accessToken, refreshToken });
  //   expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, ENV_KEY.SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
  //   expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, ENV_KEY.REFRESH_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  // });

});
