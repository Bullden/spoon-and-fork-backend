import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
export default class Bag {
  constructor(id: string, code: string) {
    this.id = id;
    this.code = code;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  code: string;
}
