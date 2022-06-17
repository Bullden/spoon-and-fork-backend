import {Field, ObjectType} from '@nestjs/graphql';
import User from '../user/User';
import AdditionalUserInfo from '../user/AdditionalUserInfo';
import Preferences from '../user/Preferences';

@ObjectType()
export default class Account {
  @Field(() => User)
  user: User;

  @Field(() => AdditionalUserInfo)
  info: AdditionalUserInfo;

  @Field(() => Preferences)
  preferences: Preferences;

  constructor(user: User, info: AdditionalUserInfo, preferences: Preferences) {
    this.user = user;
    this.info = info;
    this.preferences = preferences;
  }
}
