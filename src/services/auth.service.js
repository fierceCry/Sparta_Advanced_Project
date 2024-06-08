import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthRepositores } from '../repositories/auth.repositories.js';
import { ENV_KEY } from '../constants/env.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { BadRequestError, UnauthorizedError} from '../errors/http.error.js';
import { HASH_SALT_ROUNDS, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../constants/auth.constant.js';
export class AuthService {
  authRepositores = new AuthRepositores();

  signUp = async (email, password, nickname) => {
    const userData = await this.authRepositores.findOne(email);
    if (userData) {
      throw new BadRequestError(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
    }
    const hashPasswrd = bcrypt.hashSync(
      password,
      HASH_SALT_ROUNDS
    );
    const { password: _, ...result } = await this.authRepositores.userCreate(
      email,
      hashPasswrd,
      nickname
    );

    return result;
  };

  signIn = async (email, password) => {
    const userData = await this.authRepositores.findOne(email);
    if (!userData) {
      throw new UnauthorizedError(MESSAGES.AUTH.COMMON.EMAIL.INVALID_USER);
    }

    const isMatched = bcrypt.compareSync(password, userData.password);
    if (!isMatched) {
      throw new UnauthorizedError(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    }
    const { accessToken, refreshToken } = this.generateTokens(userData.id);

    const hashRefreshToken = bcrypt.hashSync(
      refreshToken,
      HASH_SALT_ROUNDS
    );
    await this.authRepositores.token(userData.id, hashRefreshToken);
    return { accessToken, refreshToken };
  };

  generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, ENV_KEY.SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    });

    const refreshToken = jwt.sign({ id: userId }, ENV_KEY.REFRESH_SECRET_KEY, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN
    });

    return { accessToken, refreshToken };
  };
}
