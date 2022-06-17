import {Field, ObjectType, registerEnumType} from '@nestjs/graphql';
import {ID} from 'entities/Common';
import User from 'graphql/entities/user/User';
import DocumentsRevision from 'graphql/entities/document/DocumentsRevision';
import {DocumentsRevisionStatus} from 'entities/Document';

registerEnumType(DocumentsRevisionStatus, {name: 'DocumentsRevisionStatus'});

@ObjectType()
export default class Courier {
  constructor(id: string, user: User, revision: DocumentsRevision | undefined) {
    this.id = id;
    this.user = user;
    this.revision = revision;
  }

  @Field()
  id: ID;

  @Field()
  user: User;

  @Field(() => DocumentsRevision, {nullable: true})
  revision?: DocumentsRevision | undefined;
}
