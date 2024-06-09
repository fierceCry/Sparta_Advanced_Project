import { HTTP_STATUS } from "../constants/http-status.constant.js";
export class UserController {
  constructor(authService) {
    this.authService = authService;
  }
  getProfile = async (req, res, next) => {
    try {
      const { id } = req.user
      const user = await this.authService.getUserProfile(id);
      return res.status(HTTP_STATUS.OK).json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const { id } = req.user;
      const tokens = await this.authService.generateTokens(id);
      return res.status(HTTP_STATUS.OK).json({ data: tokens });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const { id } = req.user;
      const result = await this.authService.deleteToken(id);
      return res.status(HTTP_STATUS.OK).json({ data: result });
    } catch (error) {
      next(error);
    }
  };
}
