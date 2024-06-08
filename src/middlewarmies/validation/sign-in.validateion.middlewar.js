import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
/** 유저 로그인 joi **/
export const userLoginSchema = async (req, res, next) => {
  try {
    const userSchema = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } }) // 이메일 형식을 확인
        .required()
        .empty('')
        .messages({
          'string.email': MESSAGES.AUTH.COMMON.EMAIL.INVALID_FORMAT,
          'any.required': MESSAGES.AUTH.COMMON.EMAIL.REQUIRED,
        }),

      password: Joi.string()
        .min(6) // 최소 6자리 확인
        .required()
        .empty('')
        .messages({
          'string.min': MESSAGES.AUTH.COMMON.PASSWORD.MIN_LENGTH,
          'any.required': MESSAGES.AUTH.COMMON.PASSWORD.REQURIED,
        }),
    });
    await userSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
