import {Module} from '@nestjs/common';
import {StoresModule} from 'database/stores/StoresModule';
import IAccountManager from './account/IAccountManager';
import AccountManager from './account/AccountManager';
import IIngredientManager from './ingredient/IIngredientManager';
import IngredientManager from './ingredient/IngredientManager';
import IDishManager from './dish/IDishManager';
import DishManager from './dish/DishManager';
import ISetManager from './set/ISetManager';
import SetManager from './set/SetManager';
import ICuisineManager from './cuisine/ICuisineManager';
import CuisineManager from './cuisine/CuisineManager';
import IRestaurantManager from './restaurant/IRestaurantManager';
import RestaurantManager from './restaurant/RestaurantManager';
import {AuthModule} from './auth/AuthModule';
import {ServicesModule} from 'services/ServicesModule';
import IUserManager from './user/IUserManager';
import UserManager from './user/UserManager';
import IAddressManager from './address/IAddressManager';
import IOrderManager from './order/IOrderManager';
import IPaymentManager from './payment/IPaymentManager';
import IBagManager from './bag/IBagManager';
import AddressManager from './address/AddressManager';
import OrderManager from './order/OrderManager';
import PaymentManager from './payment/PaymentManager';
import BagManager from './bag/BagManager';
import {GoogleRoadsModule} from 'services/googleRoads/GoogleRoadsModule';
import {GeoServiceModule} from 'services/geolocation/GeoServiceModule';
import IFileManager from './file/IFileManager';
import FileManager from './file/FileManager';
import IStatusManager from './status/IStatusManager';
import StatusManager from './status/StatusManager';
import IPreferencesManager from './preferences/IPreferencesManager';
import PreferencesManager from './preferences/PreferencesManager';
import CartManager from './cart/CartManager';
import ICartManager from 'managers/cart/ICartManager';
import ILocationManager from './location/ILocationManager';
import LocationManager from './location/LocationManager';
import IDocumentManager from 'managers/document/IDocumentManager';
import DocumentManager from 'managers/document/DocumentManager';
import {NotificationModule} from 'services/notification/NotificationModule';
import IEmailForSpamManager from 'managers/emailForSpamManager/IEmailFroSpam';
import EmailForSpamManager from 'managers/emailForSpamManager/EmailForSpam';

@Module({
  imports: [
    //
    StoresModule,
    AuthModule,
    ServicesModule,
    GoogleRoadsModule,
    GeoServiceModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: IFileManager,
      useClass: FileManager,
    },
    {
      provide: IAccountManager,
      useClass: AccountManager,
    },
    {
      provide: IIngredientManager,
      useClass: IngredientManager,
    },
    {
      provide: IStatusManager,
      useClass: StatusManager,
    },
    {
      provide: IDishManager,
      useClass: DishManager,
    },
    {
      provide: ISetManager,
      useClass: SetManager,
    },
    {
      provide: ICuisineManager,
      useClass: CuisineManager,
    },
    {
      provide: IRestaurantManager,
      useClass: RestaurantManager,
    },
    {
      provide: IUserManager,
      useClass: UserManager,
    },
    {
      provide: IAddressManager,
      useClass: AddressManager,
    },
    {
      provide: IOrderManager,
      useClass: OrderManager,
    },
    {
      provide: IPaymentManager,
      useClass: PaymentManager,
    },
    {
      provide: IBagManager,
      useClass: BagManager,
    },
    {
      provide: IFileManager,
      useClass: FileManager,
    },
    {
      provide: IPreferencesManager,
      useClass: PreferencesManager,
    },
    {
      provide: ICartManager,
      useClass: CartManager,
    },
    {
      provide: ILocationManager,
      useClass: LocationManager,
    },
    {
      provide: IDocumentManager,
      useClass: DocumentManager,
    },
    {
      provide: IEmailForSpamManager,
      useClass: EmailForSpamManager,
    },
  ],
  exports: [
    ICartManager,
    IFileManager,
    AuthModule,
    IAccountManager,
    IIngredientManager,
    IDishManager,
    ISetManager,
    ICuisineManager,
    IRestaurantManager,
    IUserManager,
    IAddressManager,
    IOrderManager,
    IPaymentManager,
    IBagManager,
    AuthModule,
    IFileManager,
    IStatusManager,
    ILocationManager,
    IPreferencesManager,
    IDocumentManager,
    IEmailForSpamManager,
  ],
})
export class ManagerModule {}
