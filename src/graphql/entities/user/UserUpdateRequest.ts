import {Field, InputType} from '@nestjs/graphql';

import {IsEmail, IsString, Length} from 'class-validator';

@InputType()
export default class UserUpdateRequest {
  constructor(name: string, email: string, phoneNumber: string) {
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
  }

  @Field(() => String)
  @IsString()
  @Length(3, 30)
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  phoneNumber: string;
}
