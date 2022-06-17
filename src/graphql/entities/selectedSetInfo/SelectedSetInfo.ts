import {Field, InputType} from '@nestjs/graphql';
import Set from 'graphql/entities/set/Set';

@InputType()
export default class SelectedSetInfo {
  constructor(set: Set, quantity: number, numberOfDays: number) {
    this.set = set;
    this.quantity = quantity;
    this.numberOfDays = numberOfDays;
  }

  @Field(() => Set)
  set: Set;

  @Field(() => Number)
  quantity: number;

  @Field(() => Number)
  numberOfDays: number;
}
