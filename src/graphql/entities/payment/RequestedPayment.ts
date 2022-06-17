import {Field, ObjectType, registerEnumType} from '@nestjs/graphql';
import {RequestedPaymentStatus} from 'entities/Payment';

registerEnumType(RequestedPaymentStatus, {name: 'RequestedPaymentStatus'});

@ObjectType()
export default class RequestedPayment {
  constructor(orderId: string, redirectUrl: string, status: RequestedPaymentStatus) {
    this.orderId = orderId;
    this.redirectUrl = redirectUrl;
    this.status = status;
  }

  @Field()
  orderId: string;

  @Field(() => String, {nullable: true})
  redirectUrl: string | undefined;

  @Field()
  status: RequestedPaymentStatus;
}
