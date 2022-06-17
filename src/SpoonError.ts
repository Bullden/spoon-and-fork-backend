export enum SpoonErrorType {
  TokenExpired,
  AuthFailed,
  RefreshFailed,
  ChangePasswordFailed,
  RestorePasswordFailed,
  JwtPayloadMalformed,
}

export default class SpoonError extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}
