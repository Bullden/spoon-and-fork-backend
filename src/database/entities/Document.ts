import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import File from 'database/entities/File';
import {DocumentGroup} from 'entities/Document';
import DocumentsRevision from './DocumentsRevision';

@Entity()
export default class Document {
  constructor(
    id: string,
    group: DocumentGroup,
    file: File,
    fileId: string,
    revision: DocumentsRevision,
  ) {
    this.id = id;
    this.group = group;
    this.file = file;
    this.fileId = fileId;
    this.revision = revision;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'enum', enum: DocumentGroup})
  group: DocumentGroup;

  @ManyToOne(() => File, {nullable: false})
  file?: File;

  @Column()
  fileId: string;

  @ManyToOne(() => DocumentsRevision)
  revision?: DocumentsRevision;
}
