import {Body, Controller, Post, Put, UseGuards} from '@nestjs/common';
import RegisterRequest from '../entities/RegisterRequest';
import {mapAuthResponseToApi} from '../entities/Mappers';
import IAuthManager from '../../managers/auth/IAuthManager';
import LoginRequest from '../entities/LoginRequest';
import AuthResponse from '../../entities/AuthResponse';
import RefreshTokenRequest from '../entities/RefreshTokenRequest';
import ForgotPasswordRequest from '../entities/RasswordRecoveryRequest';
import ChangePasswordRequest from '../entities/ChangePasswordRequest';
import Session from '../../entities/Session';
import AuthGuard from 'enhancers/guards/AuthGuard';
import Ignore from 'enhancers/decorators/Ignore';
import HttpRequest, {HttpRequestInfo} from 'enhancers/decorators/HttpRequest';
import CurrentSession from 'enhancers/decorators/CurrentSession';
import FirebaseTokenRequest from 'api/entities/FirebaseTokenRequest';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authManager: IAuthManager) {}

  @Post('register')
  @Ignore('Authorization')
  async register(
    @Body() request: RegisterRequest,
    @HttpRequest() {appType, platform}: HttpRequestInfo,
  ): Promise<AuthResponse> {
    return mapAuthResponseToApi(
      await this.authManager.register(
        appType,
        platform,
        request.email,
        request.password,
        request.name,
        request.phoneNumber,
      ),
    );
  }

  @Post('login')
  @Ignore('Authorization')
  async login(
    @Body() request: LoginRequest,
    @HttpRequest() {appType, platform}: HttpRequestInfo,
  ): Promise<AuthResponse> {
    return mapAuthResponseToApi(
      await this.authManager.login(appType, platform, request.email, request.password),
    );
  }

  @Post('refresh')
  @Ignore('Authorization')
  async refresh(@Body() request: RefreshTokenRequest): Promise<AuthResponse> {
    return this.authManager.refresh(request.refreshToken);
  }

  @Post('forgotPassword')
  @Ignore('Authorization')
  async forgotPassword(@Body() request: ForgotPasswordRequest): Promise<void> {
    await this.authManager.recoverPassword(request.email);
  }

  @UseGuards(AuthGuard)
  @Put('password')
  async changePassword(
    @Body() request: ChangePasswordRequest,
    @CurrentSession() session: Session,
  ): Promise<void> {
    await this.authManager.changePassword(
      session.userId,
      request.oldPassword,
      request.password,
    );
  }

  @Post('firebaseToken')
  @UseGuards(AuthGuard)
  async addFirebaseRegistrationToken(
    @Body() request: FirebaseTokenRequest,
    @CurrentSession() session: Session,
  ): Promise<void> {
    await this.authManager.updateFirebaseToken(session.token, request.registrationId);
  }
}
