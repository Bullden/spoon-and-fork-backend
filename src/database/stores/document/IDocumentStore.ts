import Document from 'database/entities/Document';
import {DocumentsRevisionStatus, DocumentGroup} from 'entities/Document';

import {ID} from 'entities/Common';

export default abstract class IDocumentStore {
  abstract getDocuments(revisionId: ID): Promise<Document[]>;

  abstract addDocument(
    revisionId: ID,
    fileId: {id: ID},
    group: DocumentGroup,
  ): Promise<Document>;

  abstract deleteDocument(id: ID): Promise<void>;

  abstract findDocumentById(id: ID): Promise<Document | undefined>;

  abstract requestDocumentsRevisionVerification(
    revisionId: ID,
    status: DocumentsRevisionStatus.VerificationRequested,
  ): Promise<void>;

  abstract evaluateRevision(
    revisionId: ID,
    status:
      | DocumentsRevisionStatus.Approved
      | DocumentsRevisionStatus.ChangesRequested
      | DocumentsRevisionStatus.Rejected,
    comment: string,
  ): Promise<void>;

  abstract createDocumentsRevisionIfNotExists(courierId: ID): Promise<void>;
}
