import { AuthService } from '../services/auth.service.js';
export class AuthsController {
  authService = new AuthService();

  signUp = async (req, res, next) => {
    try {
      const { email, password, nickname } = req.body;

      const userData = await this.authService.signUp(email, password, nickname);
      return res.status(200).json({ data: userData });
    } catch (error) {
      next(error);
    }
  };

  signIn = async (req, res, next) => {
    try{
      const { email, password} = req.body

      const userData = await this.authService.signIn(email, password);
      if(userData === '비밀번호가 맞지 않습니다'){
        return res.status(400).json({message : userData});
      }
      return res.status(200).json({ data: userData });
    }catch(error){
      next(error)
    }
  };
}
