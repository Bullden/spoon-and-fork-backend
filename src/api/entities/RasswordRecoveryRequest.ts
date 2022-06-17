import {IsEmail, IsNotEmpty} from 'class-validator';

export default class ForgotPasswordRequest {
  constructor(email: string) {
    this.email = email;
  }

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
