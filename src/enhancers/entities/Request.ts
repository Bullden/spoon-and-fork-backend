import {Request as ExpressRequest} from 'express';
import Session from 'entities/Session';
import AppType from 'entities/AppType';
import {Platform} from 'entities/Platform';

export interface Request extends ExpressRequest {
  session: Session | undefined;
  appType: AppType | undefined;
  platform: Platform | undefined;
}
