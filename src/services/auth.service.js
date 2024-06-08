import { AuthRepositores } from '../repositories/auth.repositories.js';
import bcrypt from 'bcrypt';
import { ENV_KEY } from '../constants/env.constant.js';
import { AUTH_MESSAGES } from '../constants/auth.constant.js';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/http.error.js';

export class AuthService {
  authRepositores = new AuthRepositores();

  signUp = async (email, password, nickname) => {
    const userData = await this.authRepositores.findOne(email);
    if (userData) {
      throw new BadRequestError('이미 가입 된 사용자입니다.');
    }
    const hashPasswrd = bcrypt.hashSync(
      password,
      parseInt(ENV_KEY.SALT_ROUNDS)
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
      return AUTH_MESSAGES.INVALID_AUTH;
    }

    const isMatched = bcrypt.compareSync(password, userData.password);
    if (!isMatched) {
      throw new BadRequestError('비밀번호가 맞지 않습니다.');
    }

    const accessToken = jwt.sign(
      {
        id: userData.id,
      },
      ENV_KEY.SECRET_KEY,
      {
        expiresIn: ENV_KEY.JWT_EXPIRATION_TIME,
      }
    );

    const refreshToken = jwt.sign(
      {
        id: userData.id,
      },
      ENV_KEY.REFRESH_SECRET_KEY,
      {
        expiresIn: ENV_KEY.REFRESH_TOKEN_EXPIRATION_TIME,
      }
    );

    const hashRefreshToken = bcrypt.hashSync(
      refreshToken,
      parseInt(ENV_KEY.SALT_ROUNDS)
    );
    await this.authRepositores.token(userData.id, hashRefreshToken);
    return { accessToken, refreshToken };
  };

}
