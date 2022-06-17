import {Injectable} from '@nestjs/common';
import {mapPreferencesFromDb} from 'database/entities/Mappers';
import IPreferencesStore from 'database/stores/preferences/IPreferencesStore';
import IPreferencesManager from './IPreferencesManager';
import SpoonError from 'SpoonError';
import IUserStore from 'database/stores/user/IUserStore';

@Injectable()
export default class PreferencesManager implements IPreferencesManager {
  constructor(
    private readonly preferencesStore: IPreferencesStore,
    private readonly userStore: IUserStore,
  ) {}

  async updatePreferences(
    userId: string,
    allowPushNotifications?: boolean,
    allowEmailNotifications?: boolean,
    allowSmsNotifications?: boolean,
  ) {
    await this.preferencesStore.updatePreferences(
      userId,
      allowPushNotifications,
      allowEmailNotifications,
      allowSmsNotifications,
    );

    return this.getPreferences(userId);
  }

  async getPreferences(id: string) {
    const user = await this.userStore.getUser(id);
    if (!user) throw new SpoonError('User not exist');

    const preferences = await this.preferencesStore.getPreferences(user?.preferencesId);
    if (!preferences) throw new SpoonError('Preferences not exist');

    return mapPreferencesFromDb(preferences);
  }
}
