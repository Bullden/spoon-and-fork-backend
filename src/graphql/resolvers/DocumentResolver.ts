import {Args, Mutation, Resolver, Query, registerEnumType, ID} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import AuthGuard from 'enhancers/guards/AuthGuard';
import IDocumentManager from 'managers/document/IDocumentManager';
import CurrentSession from 'enhancers/decorators/CurrentSession';
import Session from '../../entities/Session';
import Roles from 'enhancers/decorators/Roles';
import Document from 'graphql/entities/document/Document';
import {
  mapDocumentsRevisionToGQL,
  mapDocumentsToGQL,
  mapDocumentToGQL,
} from 'graphql/entities/Mappers';
import HttpRequest, {HttpRequestInfo} from '../../enhancers/decorators/HttpRequest';
import DocumentsRevision from 'graphql/entities/document/DocumentsRevision';
import {EvaluateDocumentsRevisionType, DocumentGroup} from 'entities/Document';

registerEnumType(EvaluateDocumentsRevisionType, {name: 'EvaluateDocumentsRevisionType'});

@Resolver()
@UseGuards(AuthGuard)
export default class DocumentResolver {
  constructor(private readonly documentManager: IDocumentManager) {}

  @Query(() => DocumentsRevision, {nullable: true, name: 'currentRevision'})
  @Roles('Courier')
  async getCurrentRevision(@CurrentSession() {userId}: Session) {
    const revision = await this.documentManager.getCurrentRevision(userId);
    return revision ? mapDocumentsRevisionToGQL(revision) : undefined;
  }

  @Query(() => [Document], {name: 'documents'})
  @Roles('Courier', 'Admin')
  async getDocuments(@Args({name: 'revisionId', type: () => ID}) revisionId: string) {
    return mapDocumentsToGQL(await this.documentManager.getDocuments(revisionId));
  }

  @Mutation(() => Document)
  @Roles('Courier')
  async addDocument(
    @CurrentSession() {userId}: Session,
    @HttpRequest() {appType}: HttpRequestInfo,
    @Args({name: 'fileId', type: () => ID}) fileId: string,
    @Args({name: 'group', type: () => DocumentGroup})
    group: DocumentGroup,
  ) {
    return mapDocumentToGQL(
      await this.documentManager.addDocument(userId, fileId, group, appType),
    );
  }

  @Mutation(() => Boolean)
  @Roles('Courier')
  async deleteDocument(
    @CurrentSession() {userId}: Session,
    @HttpRequest() {appType}: HttpRequestInfo,
    @Args({name: 'documentId', type: () => ID}) documentId: string,
  ) {
    await this.documentManager.deleteDocument(userId, documentId, appType);
    return true;
  }

  @Mutation(() => Boolean)
  @Roles('Courier')
  async requestDocumentsRevisionVerification(
    @CurrentSession() {userId}: Session,
    @Args({name: 'revisionId', type: () => ID}) revisionId: string,
  ) {
    await this.documentManager.requestRevisionVerification(userId, revisionId);
    return true;
  }

  @Mutation(() => Boolean)
  @Roles('Admin')
  async evaluateDocumentsRevision(
    @Args({name: 'courierId', type: () => ID}) courierId: string,
    @Args({name: 'type', type: () => EvaluateDocumentsRevisionType})
    type: EvaluateDocumentsRevisionType,
    @Args({name: 'comment', type: () => String}) comment: string,
  ) {
    await this.documentManager.evaluateRevision(courierId, type, comment);
    return true;
  }
}
