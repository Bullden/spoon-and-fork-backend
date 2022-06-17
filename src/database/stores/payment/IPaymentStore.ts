import RequestedIncomePayment from 'database/entities/RequestedIncomePayment';
import IncomePayment from 'database/entities/IncomePayment';

export default abstract class IPaymentStore {
  abstract createRequestedIncomePayment(
    payPalPaymentId: string,
  ): Promise<RequestedIncomePayment>;

  abstract createIncomePayment(requestedPayment: {id: string}): Promise<IncomePayment>;
}
