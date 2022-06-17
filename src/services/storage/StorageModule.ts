import {Module} from '@nestjs/common';
import {ConfigModule} from 'services/config/ConfigModule';
import {IConfigService} from '@spryrocks/config-node';
import {FileStorage, IFileStorage} from '@spryrocks/file-storage';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [IConfigService],
      provide: IFileStorage,
      useFactory: (configService: IConfigService) => {
        const rootDirectory = configService.get('FILE_STORAGE_ROOT_DIRECTORY');
        return new FileStorage({rootDirectory});
      },
    },
  ],
  exports: [
    //
    IFileStorage,
  ],
})
export class StorageModule {}
