import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {DocumentsRevisionStatus} from 'entities/Document';
import Courier from 'database/entities/Courier';

@Entity()
export default class DocumentsRevision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'enum', enum: DocumentsRevisionStatus})
  status: DocumentsRevisionStatus;

  @Column({default: ''})
  comment: string;

  @ManyToOne(() => Courier, {nullable: false})
  courier: Courier;

  constructor(
    id: string,
    status: DocumentsRevisionStatus,
    comment: string,
    courier: Courier,
  ) {
    this.id = id;
    this.status = status;
    this.comment = comment;
    this.courier = courier;
  }
}
