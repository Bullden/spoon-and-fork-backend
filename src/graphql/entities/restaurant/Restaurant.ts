import {Field, ID, ObjectType} from '@nestjs/graphql';
import Address from 'graphql/entities/address/Address';
import Cuisine from 'graphql/entities/cuisine/Cuisine';
import User from 'graphql/entities/user/User';

@ObjectType()
export default class Restaurant {
  constructor(
    id: string,
    user: User,
    imageId: string,
    address: Address,
    title: string,
    description: string,
    cuisines: Cuisine[],
  ) {
    this.id = id;
    this.user = user;
    this.imageId = imageId;
    this.address = address;
    this.title = title;
    this.description = description;
    this.cuisines = cuisines;
  }

  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;

  @Field(() => String)
  imageId: string;

  @Field(() => Address)
  address: Address;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => [Cuisine])
  cuisines?: Cuisine[];
}
