import FirebaseMessage from 'services/firebase/FirebaseMessage';
import Order from 'entities/Order';
import {DocumentsRevisionStatus} from 'entities/Document';
import Courier from 'entities/Courier';

type AcceptedByCourier = {
  action: 'acceptedByCourier';
  orderId: string;
  courierId: string;
};

type CheckedIn = {
  action: 'checkedIn';
  orderId: string;
  type: 'courier' | 'restaurant';
};

type CheckedOut = {
  action: 'checkedOut';
  orderId: string;
  type: 'courier' | 'restaurant';
};

type NewOrderIsAvailable = {
  action: 'newOrderIsAvailable';
  orderId: string;
};

type OrderCompleted = {
  action: 'orderCompleted';
  orderId: string;
};

type DocumentsRevisionEvaluated = {
  action: 'documentsRevisionEvaluated';
  status: DocumentsRevisionStatus;
  comment: string;
};

type DocumentsVerificationRequested = {
  action: 'documentsVerificationRequested';
  courierId: string;
};

export type NotificationData =
  | AcceptedByCourier
  | CheckedIn
  | CheckedOut
  | NewOrderIsAvailable
  | OrderCompleted
  | DocumentsRevisionEvaluated
  | DocumentsVerificationRequested;

const createData = (data: NotificationData) => data;

const createMessage = (message: FirebaseMessage<NotificationData>) => message;

export const createNewOrderCreatedMessage = (order: Order) =>
  createMessage({
    title: 'New deliveries available',
    body: `Please review and accept it`,
    data: createData({
      action: 'newOrderIsAvailable',
      orderId: order.id,
    }),
  });

export const createAcceptOrderFirebaseMessage = (
  orderId: string,
  number: number,
  courierId: string,
) =>
  createMessage({
    title: `Order accepted`,
    body: `Courier has accepted your order and is in route`,
    data: {
      action: 'acceptedByCourier',
      orderId,
      courierId,
    },
  });

export const createOrderDeliveringFirebaseMessage = (
  order: Order,
  type: 'courier' | 'restaurant',
) =>
  createMessage({
    title: 'Order is delivering',
    body: `Your order is on the way to the laundry`,
    data: createData({
      action: 'checkedIn',
      orderId: order.id,
      type,
    }),
  });

export const createOrderDeliveredFirebaseMessage = (
  order: Order,
  type: 'courier' | 'restaurant',
) =>
  createMessage({
    title: 'Order is delivered!',
    body: `Your order has delivered to the laundry!`,
    data: createData({
      action: 'checkedOut',
      orderId: order.id,
      type,
    }),
  });

export const createOrderAcceptedByLaundryFirebaseMessage = (
  order: Order,
  type: 'courier' | 'restaurant',
) =>
  createMessage({
    title: 'Laundry has accepted your order',
    body: `Your order ${order.number} to ${order.restaurant?.description} was accepted`,
    data: createData({
      action: 'checkedIn',
      orderId: order.id,
      type,
    }),
  });

export const createOrderReadyToDeliveryFromLaundryFirebaseMessage = (
  order: Order,
  type: 'restaurant',
) =>
  createMessage({
    title: 'Order is ready to delivery to client',
    body: `Your order ${order.number} is ready to delivery from ${order.restaurant?.description}`,
    data: createData({
      action: 'checkedOut',
      orderId: order.id,
      type,
    }),
  });

export const createOrderCompletedFirebaseMessage = (order: Order) =>
  createMessage({
    title: `Order ${order.number} is completed `,
    body: `Your order ${order.number} from ${order.restaurant?.description} is completed`,
    data: createData({
      action: 'orderCompleted',
      orderId: order.id,
    }),
  });

export const createDocumentsRevisionEvaluatedMessage = (
  status: DocumentsRevisionStatus,
  comment: string,
) =>
  createMessage({
    title: 'Documents evaluation',
    body: 'Your documents evaluated successfully',
    data: {
      action: 'documentsRevisionEvaluated',
      status,
      comment,
    },
  });

export const createDocumentsVerificationRequestedMessage = (courier: Courier) =>
  createMessage({
    title: 'Documents verification',
    body: `Courier ${courier.user.name} requested documents verification`,
    data: {
      action: 'documentsVerificationRequested',
      courierId: courier.id,
    },
  });
