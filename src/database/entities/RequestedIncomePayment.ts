import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export default class RequestedIncomePayment {
  constructor(id: string, created: Date, payPalPaymentId: string) {
    this.id = id;
    this.created = created;
    this.payPalPaymentId = payPalPaymentId;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column()
  payPalPaymentId: string;
}
