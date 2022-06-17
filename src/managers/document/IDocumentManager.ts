import {
  Document,
  DocumentGroup,
  DocumentsRevision,
  EvaluateDocumentsRevisionType,
} from 'entities/Document';
import {ID} from 'entities/Common';
import AppType from 'entities/AppType';

export default abstract class IDocumentManager {
  abstract getCurrentRevision(userId: ID): Promise<DocumentsRevision | undefined>;

  abstract getDocuments(revisionId: ID): Promise<Document[]>;

  abstract addDocument(
    userId: ID,
    fileId: ID,
    group: DocumentGroup,
    appType: AppType,
  ): Promise<Document>;

  abstract deleteDocument(userId: ID, documentId: ID, appType: AppType): Promise<void>;

  abstract requestRevisionVerification(userId: ID, revisionId: ID): Promise<void>;

  abstract evaluateRevision(
    courierId: ID,
    type: EvaluateDocumentsRevisionType,
    comment: string,
  ): Promise<void>;
}
