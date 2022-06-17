import {ID} from 'entities/Common';
import Order from 'entities/Order';
import Courier from 'entities/Courier';
import {DocumentsRevisionStatus} from 'entities/Document';

export default abstract class INotificationService {
  abstract sendRegistrationMessage(userName: string, email: string): Promise<void>;

  abstract sendNewPassword(userId: ID, password: string): Promise<void>;

  // abstract sendTransactionCompletedMessage(orderID: ID): Promise<void>;

  // abstract sendCourierTransactionCompletedMessage(orderID: ID): Promise<void>;

  abstract sendCreatedANewCourierMassage(userName: string): Promise<void>;

  abstract sendCreatedANewRestaurantMassage(userName: string): Promise<void>;

  abstract sendOrderAccepted(
    order: Order,
    type: 'courier',
    courier: {id: ID},
  ): Promise<void>;

  abstract sendNewOrderCreated(order: Order): Promise<void>;

  abstract sendMarkOrder(
    order: Order,
    type: 'client' | 'courier' | 'restaurant',
    // action: MarkOrderAction,
  ): Promise<void>;

  abstract sendDocumentsRevisionEvaluated(
    courier: Courier,
    status: DocumentsRevisionStatus,
    comment: string,
  ): Promise<void>;

  abstract sendDocumentsVerificationRequested(courier: Courier): Promise<void>;
}
