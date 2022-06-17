import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import File from 'database/entities/File';

@Entity()
export default class Cuisine {
  constructor(
    id: string,
    image: File,
    imageId: string,
    nationality: string,
    rating: string,
  ) {
    this.id = id;
    this.image = image;
    this.imageId = imageId;
    this.nationality = nationality;
    this.rating = rating;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => File, {nullable: false})
  image?: File;

  @Column()
  imageId: string;

  @Column()
  nationality: string;

  @Column({nullable: true})
  rating: string;
}
