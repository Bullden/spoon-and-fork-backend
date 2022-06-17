import {Module} from '@nestjs/common';
import IUserStore from 'database/stores/user/IUserStore';
import UserStore from 'database/stores/user/UserStore';
import {DatabaseModule} from 'database/DatabaseModule';
import ILoginStore from 'database/stores/login/ILoginStore';
import LoginStore from 'database/stores/login/LoginStore';
import ISessionStore from 'database/stores/session/ISessionStore';
import SessionStore from 'database/stores/session/SessionStore';
import IFileStore from 'database/stores/file/IFileStore';
import FileStore from 'database/stores/file/FileStore';
import IAddressStore from 'database/stores/address/IAddressStore';
import AddressStore from 'database/stores/address/AddressStore';
import IIngredientStore from 'database/stores/ingredient/IIngredientStore';
import IngredientStore from 'database/stores/ingredient/IngredientStore';
import IDishStore from 'database/stores/dish/IDishStore';
import DishStore from 'database/stores/dish/DishStore';
import ISetStore from 'database/stores/set/ISetStore';
import SetStore from 'database/stores/set/SetStore';
import ICuisineStore from 'database/stores/cuisine/ICuisineStore';
import CuisineStore from 'database/stores/cuisine/CuisineStore';
import IRestaurantStore from 'database/stores/restaurant/IRestaurantStore';
import RestaurantStore from 'database/stores/restaurant/RestaurantStore';
import IPaymentStore from 'database/stores/payment/IPaymentStore';
import PaymentStore from 'database/stores/payment/PaymentStore';
import IBagStore from 'database/stores/bag/IBagStore';
import BagStore from 'database/stores/bag/BagStore';
import IOrderStore from 'database/stores/order/IOrderStore';
import OrderStore from 'database/stores/order/OrderStore';
import IStatusStore from './status/IStatusStore';
import StatusStore from './status/StatusStore';
import ICartStore from './cart/ICartStore';
import CartStore from './cart/CartStore';
import IPreferencesStore from './preferences/IPreferencesStore';
import PreferencesStore from './preferences/PreferencesStore';
import DocumentStore from 'database/stores/document/DocumentStore';
import IDocumentStore from 'database/stores/document/IDocumentStore';
import IEmailForSpamStore from 'database/stores/emailForSpam/IEmailForSpamStore';
import EmailForSpamStore from 'database/stores/emailForSpam/EmailForSpamStore';

@Module({
  imports: [
    //
    DatabaseModule,
  ],
  providers: [
    {
      provide: ISessionStore,
      useClass: SessionStore,
    },
    {
      provide: IUserStore,
      useClass: UserStore,
    },
    {
      provide: ILoginStore,
      useClass: LoginStore,
    },
    {
      provide: IFileStore,
      useClass: FileStore,
    },
    {
      provide: IAddressStore,
      useClass: AddressStore,
    },
    {
      provide: IIngredientStore,
      useClass: IngredientStore,
    },
    {
      provide: IStatusStore,
      useClass: StatusStore,
    },
    {
      provide: IDishStore,
      useClass: DishStore,
    },
    {
      provide: ISetStore,
      useClass: SetStore,
    },
    {
      provide: ICuisineStore,
      useClass: CuisineStore,
    },
    {
      provide: IRestaurantStore,
      useClass: RestaurantStore,
    },
    {
      provide: IBagStore,
      useClass: BagStore,
    },
    {
      provide: IOrderStore,
      useClass: OrderStore,
    },
    {
      provide: IPaymentStore,
      useClass: PaymentStore,
    },
    {
      provide: ICartStore,
      useClass: CartStore,
    },
    {
      provide: IPreferencesStore,
      useClass: PreferencesStore,
    },
    {
      provide: IDocumentStore,
      useClass: DocumentStore,
    },
    {
      provide: IEmailForSpamStore,
      useClass: EmailForSpamStore,
    },
  ],
  exports: [
    ICartStore,
    ISessionStore,
    IUserStore,
    ILoginStore,
    IFileStore,
    IAddressStore,
    IIngredientStore,
    IPreferencesStore,
    IDishStore,
    ISetStore,
    ICuisineStore,
    IRestaurantStore,
    IBagStore,
    IOrderStore,
    IPaymentStore,
    IStatusStore,
    IDocumentStore,
    IEmailForSpamStore,
  ],
})
export class StoresModule {}
