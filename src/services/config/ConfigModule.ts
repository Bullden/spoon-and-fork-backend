import {Module} from '@nestjs/common';
import {createConfigService, getConfigEnv, IConfigService} from '@spryrocks/config-node';

@Module({
  providers: [
    {
      provide: IConfigService,
      useValue: createConfigService(getConfigEnv(), undefined),
    },
  ],
  exports: [IConfigService],
})
export class ConfigModule {}
