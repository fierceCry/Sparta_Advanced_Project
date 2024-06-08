import { UserRepository } from '../repositories/users.repositories.js';
import { ENV_KEY } from '../constants/env.constant.js';
import jwt from 'jsonwebtoken';

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  getUserProfile = async (userId) => {
    const user = await this.userRepository.findById(userId);
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  generateTokens = async (userId) => {
    const accessToken = jwt.sign({ id: userId }, ENV_KEY.SECRET_KEY, {
      expiresIn: ENV_KEY.JWT_EXPIRATION_TIME,
    });
    const refreshToken = jwt.sign({ id: userId }, ENV_KEY.REFRESH_SECRET_KEY, {
      expiresIn: ENV_KEY.REFRESH_TOKEN_EXPIRATION_TIME,
    });

    await this.tokenRepository.updateOrCreateToken(userId, refreshToken);
    return { accessToken, refreshToken };
  };

  deleteToken = async (userId) => {
    return await this.tokenRepository.deleteTokenByUserId(userId);
  };
}
