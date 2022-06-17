import {IsNotEmpty, IsString} from 'class-validator';

export default class RegisterRequest {
  constructor(name: string, email: string, phoneNumber: string, password: string) {
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
  }

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
