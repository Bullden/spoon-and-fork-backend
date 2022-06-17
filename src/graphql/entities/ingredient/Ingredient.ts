import {Field, ID, InputType, ObjectType} from '@nestjs/graphql';

@InputType('IngredientInput')
@ObjectType('Ingredient')
export default class Ingredient {
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;
}
