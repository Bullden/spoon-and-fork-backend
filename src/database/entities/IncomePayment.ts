import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import RequestedIncomePayment from 'database/entities/RequestedIncomePayment';

@Entity()
export default class IncomePayment {
  constructor(id: string, created: Date, requestedPayment: RequestedIncomePayment) {
    this.id = id;
    this.created = created;
    this.requestedPayment = requestedPayment;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @OneToOne(() => RequestedIncomePayment, {nullable: false})
  @JoinColumn()
  requestedPayment?: RequestedIncomePayment;
}
