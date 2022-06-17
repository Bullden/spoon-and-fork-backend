import {Injectable} from '@nestjs/common';
import IDocumentManager from 'managers/document/IDocumentManager';
import IDocumentStore from 'database/stores/document/IDocumentStore';
import {
  DocumentGroup,
  DocumentsRevision,
  DocumentsRevisionStatus,
  EvaluateDocumentsRevisionType,
} from 'entities/Document';
import {
  mapCourierFromDb,
  mapDocumentFromDb,
  mapDocumentRevisionFromDb,
  mapDocumentsFromDb,
} from 'database/entities/Mappers';
import {ID} from 'entities/Common';
import IUserStore from 'database/stores/user/IUserStore';
import INotificationService from 'services/notification/INotificationService';
import SpoonError from '../../SpoonError';

@Injectable()
export default class DocumentManager implements IDocumentManager {
  constructor(
    private readonly documentStore: IDocumentStore,
    private readonly userStore: IUserStore,
    private readonly notificationService: INotificationService,
  ) {}

  async getCurrentRevision(userId: ID) {
    const courier = await this.userStore.getCourierByUserIdOrThrow(userId);
    return courier.revision ? mapDocumentRevisionFromDb(courier.revision) : undefined;
  }

  async getDocuments(revisionId: ID) {
    return mapDocumentsFromDb(await this.documentStore.getDocuments(revisionId));
  }

  async addDocument(userId: ID, fileId: ID, group: DocumentGroup) {
    const courier = mapCourierFromDb(
      await this.userStore.getCourierByUserIdOrThrow(userId),
    );
    const {revision} = courier;

    if (!revision) throw new SpoonError('Revision not exists');

    this.checkCanUpdateRevision(revision);

    return mapDocumentFromDb(
      await this.documentStore.addDocument(revision.id, {id: fileId}, group),
    );
  }

  private checkCanUpdateRevision = (revision: DocumentsRevision) => {
    if (
      revision.status !== DocumentsRevisionStatus.New &&
      revision.status !== DocumentsRevisionStatus.ChangesRequested &&
      revision.status !== DocumentsRevisionStatus.Rejected
    ) {
      throw new SpoonError(`Bad revision status: ${revision.status}`);
    }
  };

  async deleteDocument(userId: ID, documentId: ID) {
    const dbDocument = await this.documentStore.findDocumentById(documentId);
    if (!dbDocument) throw new SpoonError('Document not exists');

    const courier = mapCourierFromDb(
      await this.userStore.getCourierByUserIdOrThrow(userId),
    );

    if (!courier) throw new SpoonError('Courier is not found');

    const {revision} = courier;
    if (!revision) throw new SpoonError('Courier revision is not found');

    this.checkCanUpdateRevision(revision);

    await this.documentStore.deleteDocument(documentId);
  }

  async evaluateRevision(
    courierId: ID,
    type: EvaluateDocumentsRevisionType,
    comment: string,
  ) {
    const courier = mapCourierFromDb(
      await this.userStore.getCourierByIdOrThrow(courierId),
    );

    const {revision} = courier;

    if (!revision) throw new SpoonError('Courier revision is not found');

    if (
      revision.status !== DocumentsRevisionStatus.VerificationRequested &&
      revision.status !== DocumentsRevisionStatus.ChangesRequested &&
      revision.status !== DocumentsRevisionStatus.Approved &&
      revision.status !== DocumentsRevisionStatus.Rejected
    ) {
      throw new SpoonError(`Bad revision status: ${revision.status}`);
    }

    const status = (() => {
      switch (type) {
        case EvaluateDocumentsRevisionType.Approve:
          return DocumentsRevisionStatus.Approved;
        case EvaluateDocumentsRevisionType.RequestChanges:
          return DocumentsRevisionStatus.ChangesRequested;
        case EvaluateDocumentsRevisionType.Reject:
          return DocumentsRevisionStatus.Rejected;
      }
    })();

    await this.documentStore.evaluateRevision(revision.id, status, comment);

    await this.notificationService.sendDocumentsRevisionEvaluated(
      courier,
      status,
      comment,
    );
  }

  async requestRevisionVerification(userId: ID, revisionId: ID) {
    const courier = mapCourierFromDb(
      await this.userStore.getCourierByUserIdOrThrow(userId),
    );

    if (!courier) throw new SpoonError('Courier not found');

    const {revision} = courier;
    if (!revision) throw new SpoonError('Courier revision not found');

    this.checkCanUpdateRevision(revision);

    if (revision.id !== revisionId) throw new SpoonError('userId');

    await this.documentStore.requestDocumentsRevisionVerification(
      revision.id,
      DocumentsRevisionStatus.VerificationRequested,
    );
    await this.notificationService.sendDocumentsVerificationRequested(courier);
  }
}
