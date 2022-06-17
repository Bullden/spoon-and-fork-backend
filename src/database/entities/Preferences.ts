import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export default class Preferences {
  constructor(
    id: string,
    allowPushNotifications: boolean,
    allowEmailNotifications: boolean,
    allowSmsNotifications: boolean,
  ) {
    this.id = id;
    this.allowPushNotifications = allowPushNotifications;
    this.allowEmailNotifications = allowEmailNotifications;
    this.allowSmsNotifications = allowSmsNotifications;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  allowPushNotifications: boolean;

  @Column()
  allowEmailNotifications: boolean;

  @Column()
  allowSmsNotifications: boolean;
}
