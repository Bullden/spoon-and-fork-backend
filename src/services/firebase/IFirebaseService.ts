import {ID} from 'entities/Common';
import AppType from 'entities/AppType';
import FirebaseNotification, {
  FirebaseNotificationData,
} from 'services/firebase/FirebaseMessage';
import {NotificationData} from '../notification/messages/FirebaseMessages';

export type NotificationOptions = {
  appTypes: AppType[];
};

export default abstract class IFirebaseService {
  abstract sendNotificationToUser<TData extends FirebaseNotificationData>(
    userId: ID,
    message: FirebaseNotification<NotificationData>,
    options: {appTypes: AppType[]},
  ): Promise<void>;

  abstract sendNotificationToUsers<TData extends FirebaseNotificationData>(
    userIds: ID[],
    message: FirebaseNotification<TData>,
    options: NotificationOptions,
  ): Promise<void>;
}
