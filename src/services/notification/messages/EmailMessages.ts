import EmailMessage from 'services/emailSender/EmailMessage';

type Context = {
  text?: string;
  userName?: string;
  newPassword?: string;
  courierName?: string;
  courier?: object;
  paymentID?: string;
  comment?: string;
};

export interface NewPasswordMessage extends EmailMessage<Context> {}

export interface SuccessRegistrationMessage extends EmailMessage<Context> {}

export interface DocumentApprovedMessage extends EmailMessage<Context> {}

export interface DocumentRejectedMessege extends EmailMessage<Context> {}

// export interface TransactionCompletedMessage extends EmailMessage<Context> {}
//
// export interface CourierTransactionCompletedMessage extends EmailMessage<Context> {}

export function createNewPasswordMessage(newPassword: string): NewPasswordMessage {
  return {
    template: 'NewPassword',
    subject: 'Spoon And Fork Delivery - New Password',
    context: {
      newPassword,
    },
  };
}

export function createSuccessRegistrationMessage(
  userName: string,
): SuccessRegistrationMessage {
  return {
    template: 'NewUser',
    subject: `Spoon And Fork Delivery - Welcome in our service`,
    context: {
      userName,
    },
  };
}

export function createDocumentsApprovedMessage(
  courierName: string,
): DocumentApprovedMessage {
  return {
    template: 'DocumentApproved',
    subject: 'Klean Service - Documents Revision Evaluated',
    context: {
      courierName,
    },
  };
}

export function createDocumentsRejectedMessage(
  courierName: string,
  comment: string,
): DocumentRejectedMessege {
  return {
    template: 'DocumentRejected',
    subject: 'Klean Service - Documents Revision Rejected',
    context: {
      courierName,
      comment,
    },
  };
}
//
// export function createTransactionCompletedMessage(
//   userName: string,
//   paymentID: string | undefined,
// ): TransactionCompletedMessage {
//   return {
//     template: 'Transactions',
//     subject: 'Transaction successfully completed',
//     context: {
//       paymentID,
//       userName,
//     },
//   };
// }
// export function createCourierTransactionCompletedMessage(
//   userName: string,
//   paymentID: string | undefined,
// ): CourierTransactionCompletedMessage {
//   return {
//     template: 'Transactions',
//     subject: 'Transaction successfully completed',
//     context: {
//       paymentID,
//       userName,
//     },
//   };
// }
export function createCourierMassage(userName: string): SuccessRegistrationMessage {
  return {
    template: 'NewCourier',
    subject: 'New courier created an account',
    context: {
      userName,
    },
  };
}
export function createLaundryMassage(userName: string): SuccessRegistrationMessage {
  return {
    template: 'NewLaundry',
    subject: 'New laundry created an account',
    context: {
      userName,
    },
  };
}
