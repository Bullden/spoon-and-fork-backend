import {Field, InputType} from '@nestjs/graphql';

@InputType()
export default class SetIdAndDay {
  constructor(setId: string, day: string | undefined) {
    this.setId = setId;
    this.day = day;
  }

  @Field(() => String)
  setId: string;

  @Field(() => String, {nullable: true})
  day: string | undefined;
}
