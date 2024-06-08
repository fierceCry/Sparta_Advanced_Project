import { AuthRepositores } from '../repositories/auth.repositories.js';
import bcrypt from 'bcrypt';
import { ENV_KEY } from '../constants/env.constant.js';
export class AuthService{
  authRepositores = new AuthRepositores();

  signUp = async(email, password, nickname)=>{
    console.log(email, password, nickname)
    const userData = await this.authRepositores.findOne(email);
    if(userData){
      return '이미 가입 된 사용자입니다.';
    }
    const hashPasswrd = await bcrypt.hash(password, parseInt( ENV_KEY.SALT_ROUNDS ));
    const { password: _, ...result }= await this.authRepositores.userCreate(email, hashPasswrd, nickname);

    return result;
  }
}