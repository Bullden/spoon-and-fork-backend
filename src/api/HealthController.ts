import {Controller, Get} from '@nestjs/common';
import Ignore from 'enhancers/decorators/Ignore';

@Controller('health')
export class HealthController {
  @Get()
  @Ignore('Authorization', 'AppType', 'Platform')
  // eslint-disable-next-line
  async health(): Promise<void> {}
}
