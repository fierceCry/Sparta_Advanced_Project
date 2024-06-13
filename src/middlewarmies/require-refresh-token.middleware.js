import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma.util.js';
import { ENV_KEY } from '../constants/env.constant.js';
import { validateToken } from './require-access-token.middleware.js';
import { MESSAGES } from '../constants/message.constant.js';
import {
  HttpError
} from '../errors/http.error.js';
import { UserRepository } from '../repositories/users.repository.js';

const userRepository = new UserRepository();

/** RefreshToken 토큰 검증 및 재발급 미들웨어 **/
const refreshTokenMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new HttpError.BadRequest(MESSAGES.AUTH.COMMON.JWT.NO_TOKEN);
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NOT_SUPPORTED_TYPE);
    }

    // 리프래시 토큰 검증
    const payload = await validateToken(token, ENV_KEY.REFRESH_SECRET_KEY);
    if (payload === 'expired') {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.EXPIRED);
    } else if (payload === 'JsonWebTokenError') {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.INVALID);
    }

    const tokenData = await userRepository.findByToken(payload.id);
    if (!tokenData) {
      throw new HttpError.BadRequest(MESSAGES.AUTH.COMMON.JWT.DISCARDED_TOKEN);
    }

    const isValid = bcrypt.compareSync(token, tokenData.refreshToken);
    if (!isValid) {
      throw new HttpError.BadRequest(MESSAGES.AUTH.COMMON.JWT.DISCARDED_TOKEN);
    }

    const user = await userRepository.findById(payload.id)
    if (!user) {
      throw new HttpError.NotFound(MESSAGES.AUTH.COMMON.JWT.NO_USER);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export { refreshTokenMiddleware };
