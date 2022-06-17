import INotificationService from './INotificationService';
import {ID} from 'entities/Common';
import {Injectable} from '@nestjs/common';
import {IEmailSenderService} from 'services/emailSender/IEmailSenderService';
import IUserStore from 'database/stores/user/IUserStore';
import {
  createCourierMassage,
  // createCourierTransactionCompletedMessage,
  createDocumentsApprovedMessage,
  createDocumentsRejectedMessage,
  createLaundryMassage,
  createNewPasswordMessage,
  createSuccessRegistrationMessage,
  // createTransactionCompletedMessage,
} from './messages/EmailMessages';
import {
  createAcceptOrderFirebaseMessage,
  createDocumentsRevisionEvaluatedMessage,
  createDocumentsVerificationRequestedMessage,
  createNewOrderCreatedMessage,
  // createOrderAcceptedByLaundryFirebaseMessage,
  // createOrderCompletedFirebaseMessage,
  // createOrderDeliveredFirebaseMessage,
  createOrderDeliveringFirebaseMessage,
  // createOrderReadyToDeliveryFromLaundryFirebaseMessage,
  NotificationData,
} from './messages/FirebaseMessages';
import Order from 'entities/Order';
import ISessionStore from 'database/stores/session/ISessionStore';
import IFirebaseService from 'services/firebase/IFirebaseService';
// import {MarkOrderAction} from 'graphql/entities/order/MarkOrderAction';
import FirebaseMessage from 'services/firebase/FirebaseMessage';
import AppType from 'entities/AppType';
import Courier from 'entities/Courier';
import {DocumentsRevisionStatus} from 'entities/Document';
import {mapAdminsFromDb} from 'database/entities/Mappers';
// import IOrderStore from '../../database/stores/order/IOrderStore';
import SpoonError from '../../SpoonError';
import Admin from '../../entities/Admin';

@Injectable()
export default class NotificationService extends INotificationService {
  constructor(
    private readonly userStore: IUserStore,
    private readonly sessionStore: ISessionStore,
    private readonly mailerService: IEmailSenderService,
    private readonly firebaseService: IFirebaseService, // private readonly orderStore: IOrderStore,
  ) {
    super();
  }

  async sendRegistrationMessage(userName: string, email: string) {
    const message = createSuccessRegistrationMessage(userName);
    await this.mailerService.sendMessage(email, message);
  }

  async sendNewPassword(userId: ID, password: string) {
    const user = await this.userStore.getUserOrFail(userId);
    const message = createNewPasswordMessage(password);
    await this.mailerService.sendMessage(user.email, message);
  }

  async sendDocumentsApprovedMessage(userId: ID) {
    const user = await this.userStore.getUserOrFail(userId);
    const message = createDocumentsApprovedMessage(user.name);
    await this.mailerService.sendMessage(user.email, message);
  }

  async sendDocumentsDocumentsRejectedMessage(userId: ID, comment: string) {
    const user = await this.userStore.getUserOrFail(userId);
    const message = createDocumentsRejectedMessage(user.name, comment);
    await this.mailerService.sendMessage(user.email, message);
  }
  //
  // async sendTransactionCompletedMessage(orderId: ID) {
  //   const order = await this.orderStore.getOrderByIdOrFail(orderId);
  //   const user = order.client?.user;
  //   if (!user?.email) {
  //     throw new SpoonError('There isn`t such email!');
  //   } else {
  //     const message = createTransactionCompletedMessage(user.name, order.washingInfo?.id);
  //     await this.mailerService.sendMessage(user.email, message);
  //   }
  // }

  // async SendTransactionCompletedMessage(orderId: ID) {
  //   const order = await this.orderStore.getOrderByIdOrFail(orderId);
  //   const user = order.client?.user;
  //   if (!user?.email) {
  //     throw new SpoonError('There isn`t such email!');
  //   } else {
  //     const message = createTransactionCompletedMessage(user.name, order.washingInfo?.id);
  //     await this.mailerService.sendMessage(user.email, message);
  //   }
  // }
  //
  // async sendCourierTransactionCompletedMessage(orderId: ID) {
  //   const order = await this.orderStore.getOrderByIdOrFail(orderId);
  //   const user = order.client?.user;
  //   if (!user?.email) {
  //     throw new SpoonError('There isn`t such email!');
  //   } else {
  //     const message = createCourierTransactionCompletedMessage(
  //       user.name,
  //       order.deliveryPayment?.id,
  //     );
  //     await this.mailerService.sendMessage(user.email, message);
  //   }
  // }

  async sendCreatedANewCourierMassage(userName: string) {
    const admins = await this.userStore.getEnabledAdmins();
    if (admins.length < 0) throw new SpoonError('No admin to confirm');
    const message = createCourierMassage(userName);
    admins.map(async (admin) => {
      if (!admin.user?.email) return;
      await this.mailerService.sendMessage(admin.user?.email, message);
    });
  }

  async sendCreatedANewRestaurantMassage(userName: string) {
    const admins = await this.userStore.getEnabledAdmins();
    if (admins.length < 0) throw new SpoonError('No admin to confirm');
    const message = createLaundryMassage(userName);
    admins.map(async (admin) => {
      if (!admin.user) return;
      await this.mailerService.sendMessage(admin.user.email, message);
    });
  }

  async sendOrderAccepted(order: Order, type: 'courier', courier: {id: ID}) {
    await this.firebaseService.sendNotificationToUser(
      order.client.id,
      createAcceptOrderFirebaseMessage(order.id, order.number, courier.id),
      {
        appTypes: [AppType.Client],
      },
    );
  }

  async sendNewOrderCreated(order: Order) {
    const couriers = await this.userStore.getCouriers({withoutActiveOrders: true});

    await this.firebaseService.sendNotificationToUsers(
      couriers.map((c) => c.userId),
      createNewOrderCreatedMessage(order),
      {appTypes: [AppType.Courier]},
    );
  }

  async sendMarkOrder(
    order: Order,
    type: 'client' | 'courier' | 'restaurant',
    // action: MarkOrderAction,
  ): Promise<void> {
    let userId: ID | undefined;
    let message: FirebaseMessage<NotificationData> | undefined;
    let appTypes: AppType[] | undefined;

    if (type === 'restaurant') {
      userId = order.client.id;
      message = createOrderDeliveringFirebaseMessage(order, type);
      appTypes = [AppType.Client, AppType.Restaurant];
    }
    // else if (type === 'courier' && action === MarkOrderAction.CheckOut) {
    //   userId = order.client.id;
    //   message = createOrderDeliveredFirebaseMessage(order, type);
    //   appTypes = [AppType.Client, AppType.Restaurant];
    // } else if (type === 'restaurant' && action === MarkOrderAction.CheckIn) {
    //   userId = order.client.id;
    //   message = createOrderAcceptedByLaundryFirebaseMessage(order, type);
    //   appTypes = [AppType.Client];
    // } else if (type === 'restaurant' && action === MarkOrderAction.CheckOut) {
    //   userId = order.client.id;
    //   message = createOrderReadyToDeliveryFromLaundryFirebaseMessage(order, type);
    //   appTypes = [AppType.Client, AppType.Restaurant];
    // } else if (type === 'client' && action === MarkOrderAction.CheckOut) {
    //   userId = order.client.id;
    //   message = createOrderCompletedFirebaseMessage(order);
    //   appTypes = [AppType.Client, AppType.Courier];
    // }

    if (!userId) throw new SpoonError('User id is not found');
    if (!message) throw new SpoonError('User id is not found');
    if (!appTypes) throw new SpoonError('User id is not found');

    await this.firebaseService.sendNotificationToUser(userId, message, {appTypes});
  }

  async sendDocumentsRevisionEvaluated(
    courier: Courier,
    status: DocumentsRevisionStatus,
    comment: string,
  ) {
    const user = await this.userStore.getUserOrFail(courier.user.id);
    if (status === 'Approved') {
      const message = createDocumentsApprovedMessage(user.name);
      await this.mailerService.sendMessage(user.email, message);
    } else if (status === 'Rejected') {
      const message = createDocumentsRejectedMessage(user.name, comment);
      await this.mailerService.sendMessage(user.email, message);
    }
    await this.firebaseService.sendNotificationToUser(
      courier.user.id,
      createDocumentsRevisionEvaluatedMessage(status, comment),
      {appTypes: [AppType.Courier]},
    );
  }

  async sendDocumentsVerificationRequested(courier: Courier) {
    const admins = mapAdminsFromDb(await this.userStore.getEnabledAdmins());
    if (admins.length <= 0) return;
    await this.firebaseService.sendNotificationToUsers(
      admins.map((a: Admin) => a.user.id),
      createDocumentsVerificationRequestedMessage(courier),
      {appTypes: [AppType.Admin]},
    );
  }
}
