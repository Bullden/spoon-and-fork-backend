import {Module} from '@nestjs/common';
import {ConfigModule} from 'services/config/ConfigModule';
import IConfigService from 'services/config/IConfigService';
import IRoadsService from 'services/googleRoads/IRoadsService';
import RoadsService from 'services/googleRoads/RoadService';
import {createClient} from '@google/maps';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [IConfigService],
      provide: IRoadsService,
      useFactory: async (configService: IConfigService) => {
        return new RoadsService(
          createClient({
            key: configService.get('GOOGLE_DIRECTIONS_API_KEY'),
            Promise,
          }),
        );
      },
    },
  ],
  exports: [IRoadsService],
})
export class GoogleRoadsModule {}
