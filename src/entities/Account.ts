import User from './User';
import AdditionalUserInfo from './AdditionalUserInfo';
import Preferences from 'graphql/entities/user/Preferences';

export default interface Account {
  user: User;
  info: AdditionalUserInfo;
  preferences: Preferences;
}
