import {Resolver} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import AuthGuard from '../../enhancers/guards/AuthGuard';
import IPaymentManager from 'managers/payment/IPaymentManager';

@Resolver()
@UseGuards(AuthGuard)
export class PaymentResolver {
  constructor(private readonly paymentManager: IPaymentManager) {}
}
