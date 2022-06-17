import {IsNotEmpty, IsString} from 'class-validator';

export default class RefreshTokenRequest {
  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
