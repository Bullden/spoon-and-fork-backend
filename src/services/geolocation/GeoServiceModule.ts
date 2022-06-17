import {Module} from '@nestjs/common';
import IGeoService from './IGeoService';
import GeoService from './GeoService';

@Module({
  providers: [
    {
      provide: IGeoService,
      useClass: GeoService,
    },
  ],
  exports: [IGeoService],
})
export class GeoServiceModule {}
