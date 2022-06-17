import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
export default class EmailsForSpam {
  constructor(id: string, email: string) {
    this.id = id;
    this.email = email;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  email: string;
}
