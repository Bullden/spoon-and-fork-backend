import {Column, Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne} from 'typeorm';
import Preferences from './Preferences';
import File from 'database/entities/File';

@Entity()
export default class User {
  constructor(
    id: string,
    image: File,
    imageId: string,
    name: string,
    email: string,
    phoneNumber: string,
    preferences: Preferences,
    preferencesId: string,
    lat: number,
    lng: number,
  ) {
    this.id = id;
    this.image = image;
    this.imageId = imageId;
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.preferences = preferences;
    this.preferencesId = preferencesId;
    this.lat = lat;
    this.lng = lng;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => File, {nullable: true})
  image?: File;

  @Column({nullable: true})
  imageId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @OneToOne(() => Preferences, {nullable: false})
  preferences: Preferences;

  @Column({nullable: true})
  preferencesId: string;

  @Column('float', {nullable: true})
  lat: number;

  @Column('float', {nullable: true})
  lng: number;
}
