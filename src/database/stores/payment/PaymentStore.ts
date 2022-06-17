import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import IPaymentStore from './IPaymentStore';
import IncomePayment from 'database/entities/IncomePayment';
import RequestedIncomePayment from 'database/entities/RequestedIncomePayment';

export default class PaymentStore extends IPaymentStore {
  constructor(
    @InjectRepository(RequestedIncomePayment)
    private readonly requestedIncomePaymentRepository: Repository<RequestedIncomePayment>,
    @InjectRepository(IncomePayment)
    private readonly incomePaymentRepository: Repository<IncomePayment>,
  ) {
    super();
  }

  async createRequestedIncomePayment(paymentId: string) {
    const newPayment = this.requestedIncomePaymentRepository.create({
      payPalPaymentId: paymentId,
    });
    await this.requestedIncomePaymentRepository.insert(newPayment);
    await this.requestedIncomePaymentRepository.save(newPayment);
    return newPayment;
  }

  async createIncomePayment(requestedPayment: {id: string}) {
    const newPayment = await this.incomePaymentRepository.create({
      requestedPayment,
    });
    await this.incomePaymentRepository.insert(newPayment);
    await this.incomePaymentRepository.save(newPayment);
    return newPayment;
  }
}
