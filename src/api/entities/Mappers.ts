import AuthResponse from './AuthResponse';
import ApiAuthResponse from '../../entities/AuthResponse';

export const mapAuthResponseToApi = (response: AuthResponse): ApiAuthResponse => ({
  jwt: response.jwt,
  refreshToken: response.refreshToken,
});
