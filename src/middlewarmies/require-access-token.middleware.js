import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import { ENV_KEY } from '../constants/env.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from '../errors/http.error.js';

const validateToken = async (token, secretKey) => {
  try {
    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return 'expired';
    } else {
      return 'JsonWebTokenError';
    }
  }
};

/** accessToken 토큰 검증 API **/
const authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new BadRequestError(MESSAGES.AUTH.COMMON.JWT.NO_TOKEN);
    }

    const token = authorizationHeader.split('Bearer ')[1];
    if (!token) {
      throw new UnauthorizedError(MESSAGES.AUTH.COMMON.JWT.NOT_SUPPORTED_TYPE);
    }

    const payload = await validateToken(token, ENV_KEY.SECRET_KEY);
    if (payload === 'expired') {
      throw new UnauthorizedError(MESSAGES.AUTH.COMMON.JWT.EXPIRED);
    } else if (payload === 'JsonWebTokenError') {
      throw new UnauthorizedError(MESSAGES.AUTH.COMMON.JWT.INVALID);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });
    if (!user) {
      throw new NotFoundError(MESSAGES.AUTH.COMMON.JWT.NO_USER);
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export { authMiddleware, validateToken };
