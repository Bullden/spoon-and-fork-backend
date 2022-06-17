import {Module} from '@nestjs/common';

import {GraphqlModule} from 'graphql/GraphqlModule';
import {ManagerModule} from 'managers/ManagerModule';
import {ApiModule} from 'api/ApiModule';

@Module({
  imports: [
    //
    GraphqlModule,
    ApiModule,
    ManagerModule,
  ],
})
export class AppModule {}
