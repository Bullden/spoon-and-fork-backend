import IPaymentManager from 'managers/payment/IPaymentManager';
import IUserStore from 'database/stores/user/IUserStore';
import IRestaurantStore from 'database/stores/restaurant/IRestaurantStore';
import {Injectable} from '@nestjs/common';

@Injectable()
export default class PaymentManager extends IPaymentManager {
  constructor(
    private readonly userStore: IUserStore,
    private readonly restaurantStore: IRestaurantStore,
  ) {
    super();
  }
}
