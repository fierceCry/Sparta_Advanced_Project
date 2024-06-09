import { jest } from '@jest/globals';
import { UserController } from '../../../src/controllers/users.controller.js';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';

let mockAuthService = {
  getUserProfile: jest.fn(),
  generateTokens: jest.fn(),
  deleteToken: jest.fn(),
};

let userController = new UserController(mockAuthService);

describe('UserController 유닛 테스트', () => {
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

  test('프로필 조회 성공', async () => {
    req.user.id = 1;
    const userProfile = { id: 1, email: 'test@example.com', nickname: 'test' };

    mockAuthService.getUserProfile.mockResolvedValue(userProfile);

    await userController.getProfile(req, res, next);

    expect(mockAuthService.getUserProfile).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({ data: userProfile });
  });

  test('프로필 조회 실패', async () => {
    const error = new Error('Error getting user profile');

    mockAuthService.getUserProfile.mockRejectedValue(error);

    await userController.getProfile(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('토큰 갱신 성공', async () => {
    req.user.id = 1;
    const tokens = { accessToken: 'newAccessToken', refreshToken: 'newRefreshToken' };

    mockAuthService.generateTokens.mockResolvedValue(tokens);

    await userController.refreshToken(req, res, next);

    expect(mockAuthService.generateTokens).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({ data: tokens });
  });

  test('토큰 갱신 실패', async () => {
    const error = new Error('Error generating tokens');

    mockAuthService.generateTokens.mockRejectedValue(error);

    await userController.refreshToken(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('로그아웃 성공', async () => {
    req.user.id = 1;
    const result = { success: true };

    mockAuthService.deleteToken.mockResolvedValue(result);

    await userController.logout(req, res, next);

    expect(mockAuthService.deleteToken).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({ data: result });
  });

  test('로그아웃 실패', async () => {
    const error = new Error('Error logging out');

    mockAuthService.deleteToken.mockRejectedValue(error);

    await userController.logout(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
