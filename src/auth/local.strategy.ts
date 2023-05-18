import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordFiled: 'password' }); //기본적으로 username 과 password 필드로 설정이 되어있기 때문에 username 이 아닌 email 필드로 검사하고 싶다면 contructor에 위와 같이 usernameField: 'email' 을 설정해줘야 한다
  }

  async validate(email: string, password: string) {
    const acUser = await this.authService.validateAcUser(email, password);
    if (!acUser) {
      throw new UnauthorizedException();
    }

    return acUser;
  }
}
