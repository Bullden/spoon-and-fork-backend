import ISessionStore from './ISessionStore';
import {InjectRepository} from '@nestjs/typeorm';
import {In, IsNull, Not, Repository} from 'typeorm';
import Session from '../../entities/Session';
import AppType from 'entities/AppType';
import {Platform} from 'entities/Platform';
import SpoonError from 'SpoonError';
import {ID} from 'entities/Common';
import {FindConditions} from 'typeorm/find-options/FindConditions';

export default class SessionStore extends ISessionStore {
  constructor(
    @InjectRepository(Session)
    private readonly repository: Repository<Session>,
  ) {
    super();
  }

  async createSession(
    user: {id: string},
    token: string,
    refreshToken: string,
    appType: AppType,
    platform: Platform,
  ) {
    const session = await this.repository.create({
      user,
      refreshToken,
      token,
      appType,
      platform,
    });
    await this.repository.insert(session);
    return session;
  }

  async getSession(session: {id: string}) {
    return this.repository.findOne(session.id, {
      relations: ['user'],
    });
  }

  async getSessionOrFail(sessionId: ID) {
    const session = await this.getSession({id: sessionId});
    if (!session) throw new SpoonError('Session not exists');
    return session;
  }

  async getSessionByToken(token: string) {
    return this.repository.findOne(
      {token},
      {
        relations: ['user'],
      },
    );
  }

  async getSessionByTokenOrThrow(token: string) {
    const session = await this.getSessionByToken(token);
    if (!session) throw new SpoonError('Session not found');
    return session;
  }

  async getSessionByRefreshToken(refreshToken: string) {
    return this.repository.findOne(
      {refreshToken},
      {
        relations: ['user'],
      },
    );
  }

  async updateSession(
    session: {id: string},
    token: string,
    refreshToken: string,
  ): Promise<Session> {
    await this.repository.update(session.id, {token, refreshToken});
    return this.getSessionOrFail(session.id);
  }

  async updateFirebaseToken(session: {id: string}, registrationId: string) {
    await this.repository.update(session.id, {firebaseRegistrationId: registrationId});
  }

  async getUserFirebaseTokens(userId: ID, appTypes: AppType[]): Promise<string[]> {
    let where: FindConditions<Session> = {
      userId,
      firebaseRegistrationId: Not(IsNull()),
    };
    if (appTypes) {
      where = {
        ...where,
        appType: In(appTypes),
      };
    }
    return (
      await this.repository.find({
        where,
        relations: ['user'],
        select: ['firebaseRegistrationId'],
      })
    ).map((session: Session) => session.firebaseRegistrationId as string);
  }

  async getUsersFirebaseTokens(userIds: ID[], appTypes: AppType[]): Promise<string[]> {
    let where: FindConditions<Session> = {
      userId: In(userIds),
      firebaseRegistrationId: Not(IsNull()),
    };
    if (appTypes) {
      where = {
        ...where,
        appType: In(appTypes),
      };
    }
    return (
      await this.repository.find({
        where,
        relations: ['user'],
        select: ['firebaseRegistrationId'],
      })
    ).map((session: Session) => session.firebaseRegistrationId as string);
  }
}
