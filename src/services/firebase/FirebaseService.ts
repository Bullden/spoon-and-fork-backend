import IFirebaseService, {NotificationOptions} from 'services/firebase/IFirebaseService';
import * as FirebaseAdmin from 'firebase-admin';
import {ID} from 'entities/Common';
import {Injectable} from '@nestjs/common';
import ISessionStore from 'database/stores/session/ISessionStore';
import AppType from '../../entities/AppType';
import FirebaseNotification, {
  FirebaseNotificationData,
} from 'services/firebase/FirebaseMessage';

@Injectable()
export default class FirebaseService extends IFirebaseService {
  constructor(private readonly sessionStore: ISessionStore) {
    super();
  }

  // eslint-disable-next-line class-methods-use-this
  async sendMulticastNotification<TData extends FirebaseNotificationData>(
    tokens: string[],
    message: FirebaseNotification<TData>,
  ) {
    if (tokens.length < 1) return;

    await FirebaseAdmin.messaging().sendMulticast({
      ...FirebaseService.setupNotificationMessageObject(message),
      tokens,
    });
    await FirebaseAdmin.messaging().sendMulticast({
      ...FirebaseService.setupDataMessageObject(message),
      tokens,
    });
  }

  async sendNotificationToUser<TData extends FirebaseNotificationData>(
    userId: ID,
    message: FirebaseNotification<TData>,
    options: {appTypes: AppType[]},
  ): Promise<void> {
    const tokens = await this.sessionStore.getUserFirebaseTokens(
      userId,
      options.appTypes,
    );
    await this.sendMulticastNotification(tokens, message);
  }

  async sendNotificationToUsers<TData extends FirebaseNotificationData>(
    userIds: ID[],
    message: FirebaseNotification<TData>,
    options: NotificationOptions,
  ) {
    const tokens = await this.sessionStore.getUsersFirebaseTokens(
      userIds,
      options.appTypes,
    );
    await this.sendMulticastNotification(tokens, message);
  }

  private static setupNotificationMessageObject<TData extends FirebaseNotificationData>(
    message: FirebaseNotification<TData>,
  ): {
    notification?: FirebaseAdmin.messaging.Notification;
    android?: FirebaseAdmin.messaging.AndroidConfig;
  } {
    return {
      notification: {
        title: message.title,
        body: message.body,
      },
      android: {
        priority: 'high',
        notification: {
          defaultSound: true,
          defaultVibrateTimings: true,
        },
      },
    };
  }

  private static setupDataMessageObject<TData extends FirebaseNotificationData>(
    message: FirebaseNotification<TData>,
  ): {
    data?: {[p: string]: string};
    android?: FirebaseAdmin.messaging.AndroidConfig;
  } {
    return {
      data: message.data,
      android: {
        priority: 'high',
      },
    };
  }
}
