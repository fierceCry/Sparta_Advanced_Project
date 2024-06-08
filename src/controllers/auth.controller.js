import { AuthService } from '../services/auth.service.js';
export class AuthsController {
  authService = new AuthService();

  signUp = async (req, res, next) => {
    try {
      const { email, password, nickname } = req.body;

      const userData = await this.authService.signUp(email, password, nickname);
      if (userData === '이미 가입 된 사용자입니다.') {
        return res.status(400).json({ message: userData });
      }
      return res.status(200).json({ data: userData });
    } catch (error) {
      next(error);
    }
  };

  signIn = async () => {};
}
