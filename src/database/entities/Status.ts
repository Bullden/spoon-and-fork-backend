import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import File from 'database/entities/File';

@Entity()
export default class Status {
  constructor(id: string, name: string, image: File, imageId: string) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.imageId = imageId;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => File, {nullable: false})
  image?: File;

  @Column()
  imageId: string;
}
