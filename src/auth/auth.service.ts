import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { CookieName, CreateToken, JwtPayload } from '../types';
import { COOKIES_CONFIG, SECRET_KEY } from '../config/config';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { getServerResponse } from '../utils/response.util';

@Injectable()
export class AuthService {
    private createToken(currentTokenId: string): CreateToken {
        const payload: JwtPayload = { id: currentTokenId };
        const expiresIn = 60 * 60 * 24;
        const accessToken = sign(payload, SECRET_KEY, { expiresIn });
        return {
          accessToken,
          expiresIn,
        };
      }
    
      private async generateToken(user: User): Promise<string> {
        let token;
        let userWithThisToken = null;
        do {
          token = uuid();
          userWithThisToken = await User.findOne({
            where: {
              currentTokenId: token,
            },
          })
        } while (!!userWithThisToken);
        user.currentTokenId = token;
        await user.save();
    
        return token;
      }
    
      async login(loginDto: LoginDto, res: Response) {
        const { login, password } = loginDto;
        try {
          const user = await User.findOne({
            where: {
              login,
            }
          })
          if (!user) throw new UnauthorizedException('Invalid email or password!');
    
          const match = await compare(password, user.passwordHash);
          if (!match) throw new UnauthorizedException('Invalid email or password!');
    
          const token = this.createToken(await this.generateToken(user));
    
          return res
            .cookie(CookieName.AuthToken, token.accessToken, COOKIES_CONFIG)
            .json(getServerResponse('Successfully logged in!'))
        } catch (e) {
          if (e instanceof UnauthorizedException) return res.status(e.getStatus()).json(getServerResponse(e.message));
          console.error(e);
          return res.status(500).json(getServerResponse('Something went wrong, try again later.'));
        }
      }
    
      async logout(user: User, res: Response) {
        try {
          user.currentTokenId = null;
          await user.save();
          res.clearCookie(CookieName.AuthToken, COOKIES_CONFIG);
          return res.status(200).json(getServerResponse('Successfully logged out!'));
        } catch (e) {
          console.error(e);
          return res.status(500).json(getServerResponse('Something went wrong, try again later.'));
        }
      }
}
