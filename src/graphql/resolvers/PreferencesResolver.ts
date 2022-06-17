import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import IPreferencesManager from '../../managers/preferences/IPreferencesManager';
import Preferences from '../entities/user/Preferences';
import {UseGuards} from '@nestjs/common';
import AuthGuard from 'enhancers/guards/AuthGuard';
import CurrentSession from 'enhancers/decorators/CurrentSession';
import Session from '../../entities/Session';
import {mapPreferencesToGQL} from '../entities/Mappers';

@Resolver()
@UseGuards(AuthGuard)
export class PreferencesResolver {
  constructor(private readonly preferencesManager: IPreferencesManager) {}

  @Mutation(() => Preferences)
  async updatePreferences(
    @CurrentSession() {userId}: Session,
    @Args('allowPushNotifications', {nullable: true})
    allowPushNotifications?: boolean,
    @Args('allowEmailNotifications', {nullable: true})
    allowEmailNotifications?: boolean,
    @Args('allowSmsNotifications', {nullable: true})
    allowSmsNotifications?: boolean,
  ) {
    return this.preferencesManager.updatePreferences(
      userId,
      allowPushNotifications,
      allowEmailNotifications,
      allowSmsNotifications,
    );
  }

  @Query(() => Preferences)
  async preferences(@CurrentSession() {userId}: Session) {
    return mapPreferencesToGQL(await this.preferencesManager.getPreferences(userId));
  }
}
