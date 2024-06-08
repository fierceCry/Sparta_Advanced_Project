import { UserService } from '../services/users.service.js';

const userService = new UserService();

export class UserController {
  getProfile = async (req, res, next) => {
    try {
      const user = await userService.getUserProfile(req.user.id);
      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const { id } = req.user;
      const tokens = await userService.generateTokens(id);
      res.status(200).json({ data: tokens });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const { id } = req.user;
      const result = await userService.deleteToken(id);
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  };
}
