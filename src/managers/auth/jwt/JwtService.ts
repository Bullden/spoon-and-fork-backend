import {IJwtService} from './IJwtService';
import {JwtPayload} from './JwtPayload';
import {JwtService as NestJwtService} from '@nestjs/jwt';
import {Injectable} from '@nestjs/common';

@Injectable()
export class JwtService extends IJwtService {
  constructor(private readonly jwtService: NestJwtService) {
    super();
  }

  async sign(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }

  async verify(jwt: string) {
    return this.jwtService.verifyAsync<JwtPayload>(jwt);
  }
}
