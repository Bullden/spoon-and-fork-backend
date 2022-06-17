import {createParamDecorator} from '../utils/DecoratorUtils';
import AppType from 'entities/AppType';
import {Platform} from 'entities/Platform';

export interface HttpRequestInfo {
  baseUrl: string;
  appType: AppType;
  platform: Platform;
}

export default createParamDecorator(
  (request): HttpRequestInfo => {
    const baseUrl = `${request.protocol}://${request.get('Host')}`;

    if (!request.appType) throw new Error('App type is not provided');
    if (!request.platform) throw new Error('App type is not provided');

    return {
      baseUrl,
      appType: request.appType,
      platform: request.platform,
    };
  },
);
