import {ID} from 'entities/Common';
import Preferences from 'entities/Preferences';

export default abstract class IPreferencesManager {
  abstract getPreferences(myUserId: ID): Promise<Preferences>;

  abstract updatePreferences(
    userId: string,
    allowPushNotifications?: boolean,
    allowEmailNotifications?: boolean,
    allowSmsNotifications?: boolean,
  ): Promise<Preferences>;
}
