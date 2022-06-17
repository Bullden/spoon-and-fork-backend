import {Field, ID, InputType, ObjectType} from '@nestjs/graphql';

@InputType('StatusInput')
@ObjectType('Status')
export default class Status {
  constructor(id: string, name: string, imageId: string) {
    this.id = id;
    this.name = name;
    this.imageId = imageId;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  imageId: string;
}
