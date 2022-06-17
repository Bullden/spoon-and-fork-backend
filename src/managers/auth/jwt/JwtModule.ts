import {Module} from '@nestjs/common';
import {JwtModule as NestJwtModule, JwtModuleOptions} from '@nestjs/jwt';
import {ConfigModule} from 'services/config/ConfigModule';
import {IJwtService} from './IJwtService';
import {JwtService} from './JwtService';
import {IConfigService} from '@spryrocks/config-node';

const options = (configService: IConfigService): JwtModuleOptions => ({
  secret: configService.get('JWT_SECRET'),
  signOptions: {expiresIn: configService.get('JWT_EXPIRES_IN')},
});

@Module({
  imports: [
    //
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [IConfigService],
      useFactory: options,
    }),
  ],
  providers: [
    {
      provide: IJwtService,
      useClass: JwtService,
    },
  ],
  exports: [
    //
    IJwtService,
  ],
})
export class JwtModule {}
