export enum RequestedPaymentStatus {
  Created,
  Completed,
}

export interface RequestedPayment {
  orderId: string;
  redirectUrl?: string;
  status: RequestedPaymentStatus;
}
