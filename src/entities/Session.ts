import AppType from 'entities/AppType';
import {Platform} from 'entities/Platform';

export default interface Session {
  token: string;
  userId: string;
  appType: AppType;
  platform: Platform;
}
