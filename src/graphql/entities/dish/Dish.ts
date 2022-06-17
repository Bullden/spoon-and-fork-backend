import {Field, ID, InputType, ObjectType} from '@nestjs/graphql';
import Ingredient from 'graphql/entities/ingredient/Ingredient';

@InputType('DishInput')
@ObjectType('Dish')
export default class Dish {
  constructor(
    id: string,
    name: string,
    description: string,
    imageId: string,
    weight: string,
    kal: string,
    ingredients: Ingredient[],
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.imageId = imageId;
    this.weight = weight;
    this.kal = kal;
    this.ingredients = ingredients;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  imageId: string;

  @Field(() => String)
  weight: string;

  @Field(() => String)
  kal: string;

  @Field(() => [Ingredient])
  ingredients: Ingredient[];
}
