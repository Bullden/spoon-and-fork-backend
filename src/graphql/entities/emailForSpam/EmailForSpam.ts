import {Field, ID, ObjectType} from '@nestjs/graphql';
// import LatLng from './LatLng';

@ObjectType()
export default class EmailForSpam {
  constructor(id: string, email: string, isDiscount: boolean) {
    this.id = id;
    this.email = email;
    this.isDiscount = isDiscount;
  }

  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  isDiscount: boolean;
}
