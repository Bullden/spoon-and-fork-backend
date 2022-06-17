import {Field, ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {DocumentGroup} from 'entities/Document';

registerEnumType(DocumentGroup, {name: 'DocumentGroup'});

@ObjectType()
export default class Document {
  constructor(id: string, group: string, fileId: string) {
    this.id = id;
    this.group = group;
    this.fileId = fileId;
  }

  @Field(() => ID)
  id: string;

  @Field(() => DocumentGroup)
  group: string;

  @Field(() => String)
  fileId: string;
}
