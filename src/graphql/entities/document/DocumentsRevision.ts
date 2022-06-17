import {Field, ObjectType, registerEnumType} from '@nestjs/graphql';
import {DocumentsRevisionStatus} from 'entities/Document';
import {ID} from 'entities/Common';

registerEnumType(DocumentsRevisionStatus, {name: 'DocumentsRevisionStatus'});

@ObjectType()
export default class DocumentsRevision {
  @Field()
  id: ID;

  @Field()
  comment: string;

  constructor(id: string, comment: string, status: DocumentsRevisionStatus) {
    this.id = id;
    this.comment = comment;
    this.status = status;
  }

  @Field(() => DocumentsRevisionStatus)
  status: DocumentsRevisionStatus;
}
