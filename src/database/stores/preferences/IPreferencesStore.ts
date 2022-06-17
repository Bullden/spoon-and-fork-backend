import Preferences from 'database/entities/Preferences';
import {ID} from 'entities/Common';

export default abstract class IPreferencesStore {
  abstract createPreferences(
    allowPushNotifications: boolean,
    allowEmailNotifications: boolean,
    allowSmsNotifications: boolean,
  ): Promise<Preferences>;

  abstract getPreferences(id: string): Promise<Preferences | undefined>;

  abstract getPreferencesOrFail(preferencesId: ID): Promise<Preferences>;

  abstract updatePreferences(
    userId: string,
    allowPushNotifications?: boolean,
    allowEmailNotifications?: boolean,
    allowSmsNotifications?: boolean,
  ): Promise<Preferences>;
}
