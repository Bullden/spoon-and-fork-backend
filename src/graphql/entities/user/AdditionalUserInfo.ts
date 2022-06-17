import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export default class AdditionalUserInfo {
  constructor(phoneNumber: string, email: string) {
    this.phoneNumber = phoneNumber;
    this.email = email;
  }

  @Field(() => String)
  phoneNumber: string;

  @Field(() => String)
  email: string;
}
