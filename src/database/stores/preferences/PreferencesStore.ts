import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import IPreferencesStore from './IPreferencesStore';
import {ID} from 'entities/Common';
import SpoonError from 'SpoonError';
import Preferences from '../../entities/Preferences';
import User from '../../entities/User';

export default class PreferencesStore extends IPreferencesStore {
  constructor(
    @InjectRepository(Preferences)
    private readonly repository: Repository<Preferences>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async createPreferences(
    allowPushNotifications: boolean,
    allowEmailNotifications: boolean,
    allowSmsNotifications: boolean,
  ) {
    const preferences = await this.repository.create({
      allowPushNotifications,
      allowEmailNotifications,
      allowSmsNotifications,
    });
    await this.repository.insert(preferences);
    return preferences;
  }

  async getPreferences(id: string) {
    return this.repository.findOne(id);
  }

  async updatePreferences(
    userId: string,
    allowPushNotifications?: boolean,
    allowEmailNotifications?: boolean,
    allowSmsNotifications?: boolean,
  ): Promise<Preferences> {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new SpoonError('User not exists');

    if (allowPushNotifications !== undefined) {
      await this.repository.update(user.preferencesId, {
        allowPushNotifications,
      });
    }
    if (allowEmailNotifications !== undefined) {
      await this.repository.update(user.preferencesId, {
        allowEmailNotifications,
      });
    }
    if (allowSmsNotifications !== undefined) {
      await this.repository.update(user.preferencesId, {
        allowSmsNotifications,
      });
    }

    return this.getPreferencesOrFail(user?.preferencesId);
  }

  async getPreferencesOrFail(preferencesId: ID) {
    const preferences = await this.getPreferences(preferencesId);
    if (!preferences) throw new SpoonError('Preferences not exists');
    return preferences;
  }
}
