import {Module} from '@nestjs/common';
import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm';
import User from './entities/User';
import LocalLogin from './entities/LocalLogin';
import Session from './entities/Session';
import File from './entities/File';
import Address from 'database/entities/Address';
import Ingredient from 'database/entities/Ingredient';
import Dish from 'database/entities/Dish';
import Set from 'database/entities/Set';
import Admin from 'database/entities/Admin';
import Document from 'database/entities/Document';
import DocumentsRevision from 'database/entities/DocumentsRevision';
import Cuisine from 'database/entities/Cuisine';
import Restaurant from 'database/entities/Restaurant';
import IncomePayment from 'database/entities/IncomePayment';
import RequestedIncomePayment from 'database/entities/RequestedIncomePayment';
import Bag from 'database/entities/Bag';
import Order from 'database/entities/Order';
import {IConfigService} from '@spryrocks/config-node';
import {ConfigModule} from 'services/config/ConfigModule';
import Client from './entities/Client';
import Courier from './entities/Courier';
import Status from './entities/Status';
import OrderInfo from './entities/OrderInfo';
import OrderMark from './entities/OrderMark';
import Cart from './entities/Cart';
import Preferences from './entities/Preferences';
import EmailsForSpam from './entities/EmailsForSpam';

const entities = [
  //
  User,
  Preferences,
  LocalLogin,
  Session,
  File,
  Address,
  Ingredient,
  Status,
  Dish,
  Set,
  Cuisine,
  Restaurant,
  IncomePayment,
  RequestedIncomePayment,
  Bag,
  Order,
  Client,
  Courier,
  OrderInfo,
  OrderMark,
  Cart,
  Admin,
  Document,
  DocumentsRevision,
  EmailsForSpam,
];

const options = (configService: IConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: configService.getNumber('DATABASE_PORT'),
  username: configService.get('DATABASE_USERNAME'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  synchronize: configService.getBoolean('DATABASE_SYNCHRONIZE', false),
  logging: 'all',
  entities,
});

@Module({
  imports: [
    //
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [IConfigService],
      useFactory: options,
    }),
    TypeOrmModule.forFeature(entities),
  ],
  exports: [
    //
    TypeOrmModule,
  ],
})
export class DatabaseModule {}
