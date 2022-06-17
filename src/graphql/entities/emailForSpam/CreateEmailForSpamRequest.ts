import {Field, InputType} from '@nestjs/graphql';

@InputType()
export default class CreateEmailForSpamRequest {
  constructor(email: string, isDiscount: boolean) {
    this.email = email;
    this.isDiscount = isDiscount;
  }

  @Field()
  email: string;

  @Field()
  isDiscount: boolean;
}
