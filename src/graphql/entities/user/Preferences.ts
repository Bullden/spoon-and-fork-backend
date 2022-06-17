import {Field, ObjectType, ID} from '@nestjs/graphql';

@ObjectType()
export default class Preferences {
  constructor(
    id: string,
    allowPushNotifications: boolean,
    allowEmailNotifications: boolean,
    allowSmsNotifications: boolean,
  ) {
    this.id = id;
    this.allowPushNotifications = allowPushNotifications;
    this.allowEmailNotifications = allowEmailNotifications;
    this.allowSmsNotifications = allowSmsNotifications;
  }

  @Field(() => ID)
  id: string;

  @Field(() => Boolean)
  allowPushNotifications: boolean;

  @Field(() => Boolean)
  allowEmailNotifications: boolean;

  @Field(() => Boolean)
  allowSmsNotifications: boolean;
}
