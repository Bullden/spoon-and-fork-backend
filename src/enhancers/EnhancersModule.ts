import {Module} from '@nestjs/common';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {AuthInterceptor} from './interceptors/AuthInterceptor';
import {ManagerModule} from 'managers/ManagerModule';

@Module({
  imports: [
    //
    ManagerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
  ],
  exports: [
    //
  ],
})
export class EnhancersModule {}
