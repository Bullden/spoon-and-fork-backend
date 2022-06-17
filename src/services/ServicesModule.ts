import {Module} from '@nestjs/common';
import {ConfigModule} from 'services/config/ConfigModule';
import {StorageModule} from 'services/storage/StorageModule';

@Module({
  imports: [
    //
    ConfigModule,
    StorageModule,
  ],
  providers: [],
  exports: [
    //
    ConfigModule,
    StorageModule,
  ],
})
export class ServicesModule {}
