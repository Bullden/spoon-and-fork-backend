import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
export default class Cuisine {
  constructor(
    id: string,
    imageId: string,
    nationality: string,
    rating: string | undefined,
  ) {
    this.id = id;
    this.imageId = imageId;
    this.nationality = nationality;
    this.rating = rating;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  imageId: string;

  @Field(() => String)
  nationality: string;

  @Field(() => String, {nullable: true})
  rating: string | undefined;
}
