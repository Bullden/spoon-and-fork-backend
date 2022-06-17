export interface JwtPayload {
  userId: string;
  sessionToken: string;
  appType: string;
  platform: string;
}
