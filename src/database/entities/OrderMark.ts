import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export default class OrderMark {
  constructor(id: string, date: Date, lat: number, lng: number) {
    this.id = id;
    this.date = date;
    this.lat = lat;
    this.lng = lng;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  date: Date;

  @Column('decimal', {nullable: true})
  lat?: number;

  @Column('decimal', {nullable: true})
  lng?: number;
}
