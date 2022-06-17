import {Module} from '@nestjs/common';
import IRouter from './IRouter';
import Router from './Router';
import {ConfigModule} from 'services/config/ConfigModule';

@Module({
  imports: [
    //
    ConfigModule,
  ],
  providers: [
    {
      provide: IRouter,
      useClass: Router,
    },
  ],
  exports: [
    //
    IRouter,
  ],
})
export class RouterModule {}
