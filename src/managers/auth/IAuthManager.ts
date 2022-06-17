import AuthResponse from '../../entities/AuthResponse';
import Session from '../../entities/Session';
import {ID} from 'entities/Common';
import AppType from 'entities/AppType';
import {Platform} from 'entities/Platform';
import User from 'database/entities/User';

export default abstract class IAuthManager {
  abstract register(
    appType: AppType,
    platform: Platform,
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
  ): Promise<AuthResponse>;

  abstract registerRestaurant(
    appType: AppType,
    platform: Platform,
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
  ): Promise<User>;

  abstract login(
    appType: AppType,
    platform: Platform,
    email: string,
    password: string,
  ): Promise<AuthResponse>;

  abstract getSessionFromTokenOrThrow(jwt: string): Promise<Session>;

  abstract validateSessionOrThrow(jwt: string): Promise<Session>;

  abstract refresh(refreshToken: string): Promise<AuthResponse>;

  abstract recoverPassword(email: string): Promise<void>;

  abstract async changePassword(
    userId: ID,
    oldPassword: string,
    password: string,
  ): Promise<void>;

  abstract updateFirebaseToken(token: string, registrationId: string): Promise<void>;
}
