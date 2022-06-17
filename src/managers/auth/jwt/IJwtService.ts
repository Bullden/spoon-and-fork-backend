import {JwtPayload} from './JwtPayload';

export abstract class IJwtService {
  abstract sign(payload: JwtPayload): Promise<string>;

  abstract verify(jwt: string): Promise<JwtPayload>;
}
