import {Module, ValidationPipe} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {StoresModule} from 'database/stores/StoresModule';
import {AccountResolver} from './resolvers/AccountResolver';
import RestaurantResolver from './resolvers/RestaurantResolver';
import CuisineResolver from './resolvers/CuisineResolver';
import SetResolver from './resolvers/SetResolver';
import DishResolver from './resolvers/DishResolver';
import IngredientResolver from './resolvers/IngredientResolver';
import {ManagerModule} from 'managers/ManagerModule';
import {EnhancersModule} from 'enhancers/EnhancersModule';
import {APP_PIPE} from '@nestjs/core';
import {RouterModule} from 'router/RouterModule';
import BagResolver from './resolvers/BagResolver';
import OrderResolver from './resolvers/OrderResolver';
import {PaymentResolver} from './resolvers/PaymentResolver';
import {PreferencesResolver} from './resolvers/PreferencesResolver';
import UserResolver from './resolvers/UserResolver';
import CartResolver from './resolvers/CartResolver';
import {LocationResolver} from './resolvers/LocationResolver';
import StatusResolver from './resolvers/StatusResolver';
import DocumentResolver from './resolvers/DocumentResolver';
import {EmailForSpamResolver} from 'graphql/resolvers/EmailForSpamResolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.graphql',
      tracing: true,
      context: (context) => context,
      useGlobalPrefix: true,
    }),
    ManagerModule,
    EnhancersModule,
    RouterModule,
    StoresModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AccountResolver,
    RestaurantResolver,
    CuisineResolver,
    SetResolver,
    DishResolver,
    IngredientResolver,
    BagResolver,
    OrderResolver,
    PaymentResolver,
    UserResolver,
    PreferencesResolver,
    CartResolver,
    LocationResolver,
    StatusResolver,
    DocumentResolver,
    EmailForSpamResolver,
  ],
})
export class GraphqlModule {}
