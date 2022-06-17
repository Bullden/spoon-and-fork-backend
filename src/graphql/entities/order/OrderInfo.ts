import {Field, Int, ObjectType} from '@nestjs/graphql';
import Address from '../address/Address';

@ObjectType()
export default class OrderInfo {
  constructor(
    id: string,
    clientAddress: Address,
    distanceMiles: number,
    priceCents: number,
  ) {
    this.id = id;
    this.clientAddress = clientAddress;
    this.distanceMiles = distanceMiles;
    this.priceCents = priceCents;
  }

  @Field()
  id: string;

  @Field()
  clientAddress: Address;

  @Field({nullable: true})
  distanceMiles?: number;

  @Field(() => Int)
  priceCents: number;
}
