import { jest } from '@jest/globals';
import { AuthsController } from '../../../src/controllers/auth.controller.js';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';
import {
  BadRequestError,
  UnauthorizedError,
} from '../../../src/errors/http.error.js';

let mockAuthService = {
  signUp: jest.fn(),
  signIn: jest.fn(),
};

let authsController = new AuthsController(mockAuthService);

describe('AuthsController 테스트', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test('회원가입 성공', async () => {
    req.body = {
      email: 'aa4518@naver.com',
      password: 'password',
      checkPassword: 'password',
      nickname: 'kimmangyu',
    };
    const userData = { id: 1, email: 'aa4518@naver.com', nickname: 'kimmangyu' };

    mockAuthService.signUp.mockResolvedValue(userData);

    await authsController.signUp(req, res, next);

    expect(mockAuthService.signUp).toHaveBeenCalledWith(
      'aa4518@naver.com',
      'password',
      'kimmangyu'
    );
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({ data: userData });
  });

  test('회원가입 중복 이메일', async () => {
    req.body = {
      email: 'aa4518@naver.com',
      password: 'password',
      checkPassword: 'password',
      nickname: 'kimmangyu',
    };
    const error = new BadRequestError('Email already exists');

    mockAuthService.signUp.mockRejectedValue(error);

    await authsController.signUp(req, res, next);

    expect(mockAuthService.signUp).toHaveBeenCalledWith(
      'aa4518@naver.com',
      'password',
      'kimmangyu'
    );
    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('로그인 성공', async () => {
    req.body = { email: 'aa4518@naver.com', password: 'password' };
    const userData = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    mockAuthService.signIn.mockResolvedValue(userData);

    await authsController.signIn(req, res, next);

    expect(mockAuthService.signIn).toHaveBeenCalledWith(
      'aa4518@naver.com',
      'password'
    );
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith({ data: userData });
  });

  test('로그인 이메일 또는 패스워드', async () => {
    req.body = { email: 'aa4520@naver.com', password: 'password' };
    const error = new UnauthorizedError('Invalid email or password');

    mockAuthService.signIn.mockRejectedValue(error);

    await authsController.signIn(req, res, next);

    expect(mockAuthService.signIn).toHaveBeenCalledWith(
      'aa4520@naver.com',
      'password'
    );
    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});