import {Field, ObjectType} from '@nestjs/graphql';
import {ID} from 'entities/Common';
import User from 'graphql/entities/user/User';

@ObjectType()
export default class Client {
  constructor(id: string, user: User) {
    this.id = id;
    this.user = user;
  }

  @Field()
  id: ID;

  @Field()
  user: User;
}
