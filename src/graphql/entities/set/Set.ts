import {Field, ID, InputType, Int, ObjectType} from '@nestjs/graphql';
import Dish from 'graphql/entities/dish/Dish';
import Status from 'graphql/entities/status/Status';

@InputType('SetInput')
@ObjectType('Set')
export default class Set {
  constructor(
    id: string,
    name: string,
    imageId: string,
    cuisineId: string,
    priceCents: number,
    dishes: Dish[],
    statuses: Status[],
    day: string | undefined,
    isFavorite: boolean | undefined,
  ) {
    this.id = id;
    this.name = name;
    this.imageId = imageId;
    this.cuisineId = cuisineId;
    this.priceCents = priceCents;
    this.dishes = dishes;
    this.statuses = statuses;
    this.day = day;
    this.isFavorite = isFavorite;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  imageId: string;

  @Field(() => String)
  cuisineId: string;

  @Field(() => Int)
  priceCents: number;

  @Field(() => [Dish])
  dishes: Dish[];

  @Field(() => [Status])
  statuses: Status[];

  @Field(() => String, {nullable: true})
  day: string | undefined;

  @Field(() => Boolean, {nullable: true})
  isFavorite: boolean | undefined;
}
