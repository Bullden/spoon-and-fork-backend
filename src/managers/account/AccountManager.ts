import {Injectable} from '@nestjs/common';
import IUserStore from 'database/stores/user/IUserStore';
import IAccountManager from './IAccountManager';
import {mapAccountFromDB} from 'database/entities/Mappers';
import SpoonError from 'SpoonError';
import IPreferencesStore from '../../database/stores/preferences/IPreferencesStore';

@Injectable()
export default class AccountManager implements IAccountManager {
  constructor(
    private userStore: IUserStore,
    private preferencesStore: IPreferencesStore,
  ) {}

  async getMyAccount(myUserId: string) {
    const dbUser = await this.userStore.getUser(myUserId);
    if (!dbUser) throw new SpoonError('User is not found');
    const dbPreferences = await this.preferencesStore.getPreferences(
      dbUser.preferencesId,
    );
    if (!dbPreferences) throw new SpoonError('Preferences is not found');
    return mapAccountFromDB(dbUser, dbPreferences);
  }

  async updateAccount(
    myUserId: string,
    user: {
      name: string;
      birthday: Date;
      email: string;
      phoneNumber: string;
    },
  ) {
    await this.userStore.updateUser(myUserId, user);
    const dbUser = await this.userStore.getUser(myUserId);
    if (!dbUser) throw new SpoonError('User is not found');
    const dbPreferences = await this.preferencesStore.getPreferences(
      dbUser.preferencesId,
    );
    if (!dbPreferences) throw new SpoonError('Preferences is not found');
    return mapAccountFromDB(dbUser, dbPreferences);
  }

  async updateAccountImage(myUserId: string, image: string) {
    await this.userStore.updateUserImage(myUserId, image);
  }
}
