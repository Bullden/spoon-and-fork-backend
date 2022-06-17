import {Module, ValidationPipe} from '@nestjs/common';
import {APP_INTERCEPTOR, APP_PIPE} from '@nestjs/core';
import {EnhancersModule} from 'enhancers/EnhancersModule';
import {ManagerModule} from 'managers/ManagerModule';
import {AuthController} from './auth/AuthController';
import {MulterModule} from '@nestjs/platform-express';
import {memoryStorage} from 'multer';
import {ApiExceptionInterceptor} from 'enhancers/interceptors/ApiExceptionInterceptor';
import {RouterModule} from 'router/RouterModule';
import {HealthController} from 'api/HealthController';
import {FilesController} from './file/FileController';

@Module({
  imports: [
    //
    ManagerModule,
    EnhancersModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: memoryStorage(),
      }),
    }),
    RouterModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiExceptionInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  controllers: [
    //
    AuthController,
    HealthController,
    FilesController,
  ],
  exports: [],
})
export class ApiModule {}
