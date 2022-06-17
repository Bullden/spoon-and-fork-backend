import {IsNotEmpty, IsString} from 'class-validator';

export default class ChangePasswordRequest {
  constructor(oldPassword: string, password: string) {
    this.oldPassword = oldPassword;
    this.password = password;
  }

  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
