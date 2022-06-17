import {Field, InputType} from '@nestjs/graphql';
import {IsString} from 'class-validator';

@InputType()
export default class RestaurantUpdateRequest {
  constructor(
    userId: string,
    imageId: string,
    address: string,
    description: string,
    title: string,
  ) {
    this.userId = userId;
    this.imageId = imageId;
    this.address = address;
    this.title = title;
    this.description = description;
  }

  @Field()
  @IsString()
  userId: string;

  @Field()
  imageId: string;

  @Field()
  @IsString()
  address: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;
}
