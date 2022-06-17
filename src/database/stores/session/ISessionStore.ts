import Session from '../../entities/Session';
import AppType from 'entities/AppType';
import {Platform} from 'entities/Platform';
import {ID} from 'entities/Common';

export default abstract class ISessionStore {
  abstract createSession(
    user: {id: string},
    token: string,
    refreshToken: string,
    appType: AppType,
    platform: Platform,
  ): Promise<Session>;

  abstract getSession(session: {id: string}): Promise<Session | undefined>;

  abstract getSessionOrFail(sessionId: ID): Promise<Session>;

  abstract getSessionByToken(token: string): Promise<Session | undefined>;

  abstract getSessionByTokenOrThrow(token: string): Promise<Session>;

  abstract getSessionByRefreshToken(refreshToken: string): Promise<Session | undefined>;

  abstract updateSession(
    session: {id: string},
    token: string,
    refreshToken: string,
  ): Promise<Session>;

  abstract updateFirebaseToken(
    session: {id: string},
    registrationId: string,
  ): Promise<void>;

  abstract getUserFirebaseTokens(userId: ID, appTypes: AppType[]): Promise<string[]>;

  abstract getUsersFirebaseTokens(userId: ID[], appTypes: AppType[]): Promise<string[]>;
}
