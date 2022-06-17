import {Field, ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {CartState} from 'entities/Cart';

registerEnumType(CartState, {name: 'CartState'});

@ObjectType()
export default class Cart {
  constructor(id: string, userId: string, status: CartState) {
    this.id = id;
    this.userId = userId;
    this.status = status;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => CartState)
  status: CartState;
}
