import IAuthManager from './IAuthManager';
import AuthResponse from '../../entities/AuthResponse';
import IUserStore from '../../database/stores/user/IUserStore';
import {Injectable} from '@nestjs/common';
import ILoginStore from '../../database/stores/login/ILoginStore';
import * as bcrypt from 'bcrypt';
import DbUser from '../../database/entities/User';
import SpoonError from 'SpoonError';
import LocalLogin from '../../database/entities/LocalLogin';
import ISessionStore from '../../database/stores/session/ISessionStore';
import {IJwtService} from './jwt/IJwtService';
import {JwtPayload} from './jwt/JwtPayload';
import {pbkdf2Sync, randomBytes} from 'crypto';
import Session from '../../database/entities/Session';
import AppSession from 'entities/Session';
import SpoonAuthError, {SpoonAuthErrorType} from './SpoonAndForkAuthError';
import {generate as generatePassword} from 'generate-password';
import {ID} from 'entities/Common';
import AppType from 'entities/AppType';
import {Platform} from 'entities/Platform';
import INotificationService from 'services/notification/INotificationService';
import IPreferencesStore from 'database/stores/preferences/IPreferencesStore';
import User from 'database/entities/User';
import IDocumentStore from 'database/stores/document/IDocumentStore';

@Injectable()
export default class AuthManager extends IAuthManager {
  constructor(
    private readonly userStore: IUserStore,
    private readonly loginStore: ILoginStore,
    private readonly sessionStore: ISessionStore,
    private readonly documentStore: IDocumentStore,
    private readonly preferencesStore: IPreferencesStore,
    private readonly jwtService: IJwtService,
    private readonly notificationService: INotificationService,
  ) {
    super();
  }

  async register(
    appType: AppType,
    platform: Platform,
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
  ): Promise<AuthResponse> {
    if (await this.loginStore.findLocalLoginByEmail(email)) {
      throw new SpoonError('User with the same email already exists');
    }

    const preferences = await this.preferencesStore.createPreferences(true, true, true);

    const user = await this.userStore.createUser({
      name,
      email,
      phoneNumber,
      preferencesId: preferences.id,
    });
    await this.notificationService.sendRegistrationMessage(user.name, email);
    const login = await this.createLocalLogin(user, email, password);
    return this.createSession(login.user, appType, platform);
  }

  async registerRestaurant(
    appType: AppType,
    platform: Platform,
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
  ): Promise<User> {
    if (await this.loginStore.findLocalLoginByEmail(email)) {
      throw new SpoonError('User with the same email already exists');
    }

    const preferences = await this.preferencesStore.createPreferences(true, true, true);

    const user = await this.userStore.createUser({
      name,
      email,
      phoneNumber,
      preferencesId: preferences.id,
    });
    await this.notificationService.sendRegistrationMessage(user.name, email);
    await this.createLocalLogin(user, email, password);
    return user;
  }

  async login(appType: AppType, platform: Platform, email: string, password: string) {
    const login = await this.findLoginOrThrow({email}, SpoonAuthErrorType.AuthFailed);

    await AuthManager.checkPasswordOrThrow(
      login,
      password,
      SpoonAuthErrorType.AuthFailed,
    );
    return this.createSession(login.user, appType, platform);
  }

  private static async checkPasswordOrThrow(
    login: LocalLogin,
    password: string,
    errorType: SpoonAuthErrorType,
  ) {
    if (!(await AuthManager.isPasswordValid(login, password))) {
      throw new SpoonAuthError('Password is not valid', errorType);
    }
  }

  private async findLoginOrThrow(
    user: {email?: string; id?: ID},
    errorType: SpoonAuthErrorType,
  ): Promise<LocalLogin> {
    let login;
    if (user.email) {
      login = await this.loginStore.getLocalLoginByEmail(user.email);
    } else if (user.id) {
      login = await this.loginStore.getLocalLoginByUser({id: user.id});
    }

    if (!login) {
      throw new SpoonAuthError('Login not found', errorType);
    }

    return login;
  }

  private async createLocalLogin(user: DbUser, email: string, password: string) {
    const passwordHash = await AuthManager.createPasswordHash(password);

    return this.loginStore.createLocalLogin(user, email, passwordHash);
  }

  private static async createPasswordHash(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private static async isPasswordValid(login: LocalLogin, password: string) {
    return bcrypt.compare(password, login.passwordHash);
  }

  private static createCryptoToken(): string {
    const tmp = randomBytes(32).toString('hex');
    return pbkdf2Sync(tmp, tmp, 2048, 32, 'sha512').toString('hex');
  }

  private async createSession(
    user: DbUser,
    appType: AppType,
    platform: Platform,
  ): Promise<AuthResponse> {
    switch (appType) {
      case AppType.Client: {
        await this.userStore.createClientIfNotExists(user.id);
        break;
      }
      case AppType.Courier: {
        const courier = await this.userStore.createCourierIfNotExists(user.id);
        await this.notificationService.sendCreatedANewCourierMassage(user.name);
        await this.documentStore.createDocumentsRevisionIfNotExists(courier.id);
        break;
      }
    }

    return this.createSessionInfo(appType, platform, user, (token, refreshToken) =>
      this.sessionStore.createSession(user, token, refreshToken, appType, platform),
    );
  }

  public async refresh(refreshToken: string) {
    const session = await this.sessionStore.getSessionByRefreshToken(refreshToken);
    if (!session) {
      throw new SpoonAuthError('Session not found', SpoonAuthErrorType.RefreshFailed);
    }
    return this.createSessionInfo(
      session.appType,
      session.platform,
      session.user,
      (token: string, refreshToken: string) =>
        this.sessionStore.updateSession(session, token, refreshToken),
    );
  }

  private async createSessionInfo(
    appType: AppType,
    platform: Platform,
    user: DbUser,
    createOrUpdateSession: (token: string, refreshToken: string) => Promise<Session>,
  ) {
    const token = AuthManager.createCryptoToken();
    const refreshToken = AuthManager.createCryptoToken();
    const session = await createOrUpdateSession(token, refreshToken);
    if (!session) {
      throw new SpoonError('Session wasn`t created!');
    }
    const payload: JwtPayload = {
      userId: user.id,
      sessionToken: session.token,
      appType: AppType[appType],
      platform: Platform[platform],
    };
    const jwt = await this.jwtService.sign(payload);
    return {jwt, refreshToken};
  }

  async getSessionFromTokenOrThrow(jwt: string) {
    try {
      const {
        userId,
        sessionToken,
        appType: appTypeString,
        platform: platformString,
      } = await this.jwtService.verify(jwt);

      const appType = AppType[appTypeString as AppType];
      if (!appType)
        throw new SpoonAuthError(
          'JWT payload should contains a valid appType',
          SpoonAuthErrorType.JwtPayloadMalformed,
        );

      const platform = Platform[platformString as Platform];
      if (!platform)
        throw new SpoonAuthError(
          'JWT payload should contains a valid platform',
          SpoonAuthErrorType.JwtPayloadMalformed,
        );

      const session: AppSession = {
        token: sessionToken,
        userId,
        appType,
        platform,
      };

      return session;
    } catch (e) {
      if (e.message === 'jwt expired') {
        throw new SpoonAuthError('JWT token expired', SpoonAuthErrorType.TokenExpired);
      }
      throw new SpoonError(e.message);
    }
  }

  async validateSessionOrThrow(jwt: string) {
    const session = await this.getSessionFromTokenOrThrow(jwt);

    const dbSession = await this.sessionStore.getSessionByToken(session.token);
    if (!dbSession)
      throw new SpoonAuthError('Session not found', SpoonAuthErrorType.AuthFailed);
    if (dbSession.user.id !== session.userId)
      throw new SpoonAuthError('User malformed', SpoonAuthErrorType.AuthFailed);
    if (dbSession.appType !== session.appType)
      throw new SpoonAuthError('appType malformed', SpoonAuthErrorType.AuthFailed);

    return session;
  }

  private static generateNewPassword() {
    return generatePassword({
      length: 10,
      numbers: true,
      symbols: true,
      uppercase: true,
    });
  }

  async recoverPassword(email: string) {
    const login = await this.findLoginOrThrow(
      {email},
      SpoonAuthErrorType.RestorePasswordFailed,
    );

    const password = AuthManager.generateNewPassword();

    this.updatePassword(login, password);

    await this.notificationService.sendNewPassword(login.user.id, password);
  }

  async updatePassword(login: LocalLogin, password: string) {
    const passwordHash = await AuthManager.createPasswordHash(password);
    await this.loginStore.updateLocalLoginPassword(login, passwordHash);
  }

  async changePassword(userId: ID, oldPassword: string, password: string) {
    const login = await this.findLoginOrThrow(
      {id: userId},
      SpoonAuthErrorType.ChangePasswordFailed,
    );

    await AuthManager.checkPasswordOrThrow(
      login,
      oldPassword,
      SpoonAuthErrorType.ChangePasswordFailed,
    );

    await this.updatePassword(login, password);
  }

  async updateFirebaseToken(token: string, registrationId: string) {
    const session = await this.sessionStore.getSessionByTokenOrThrow(token);
    await this.sessionStore.updateFirebaseToken(session, registrationId);
  }
}
