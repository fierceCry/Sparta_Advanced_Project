import { HTTP_STATUS } from '../constants/http-status.constant.js';

export class AuthsController {
  constructor(authService) {
    this.authService = authService;
  }

  signUp = async (req, res, next) => {
    try {
      const { email, password, nickname } = req.body;
      const userData = await this.authService.signUp(email, password, nickname);
      return res.status(HTTP_STATUS.OK).json({ data: userData });
    } catch (error) {
      next(error);
    }
  };

  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const userData = await this.authService.signIn(email, password);
      return res.status(HTTP_STATUS.OK).json({ data: userData });
    } catch (error) {
      next(error);
    }
  };
}
