import SpoonError from '../../SpoonError';

export enum SpoonAuthErrorType {
  TokenExpired,
  AuthFailed,
  RefreshFailed,
  ChangePasswordFailed,
  RestorePasswordFailed,
  JwtPayloadMalformed,
}

export default class SpoonAndForkAuthError extends SpoonError {
  constructor(message: string, public readonly type: SpoonAuthErrorType) {
    super(message);
  }
}
