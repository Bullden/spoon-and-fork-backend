import {NestFactory} from '@nestjs/core';
import {ExpressAdapter} from '@nestjs/platform-express';
import {AppModule} from './AppModule';
import express from 'express';
import {httpLogger} from './AppUtils';
import {createConfigService, getConfigEnv} from '@spryrocks/config-node';

export async function initApplication() {
  const configService = createConfigService(getConfigEnv(), undefined);

  const server = express().set('trust proxy', true);

  const globalPrefix = configService.getOptional('HTTP_GLOBAL_PREFIX');
  const httpPort = configService.getNumber('HTTP_PORT');

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  if (globalPrefix) {
    app.setGlobalPrefix(globalPrefix);
  }
  app.use(httpLogger()).enableCors();
  await app.listen(httpPort);
}
