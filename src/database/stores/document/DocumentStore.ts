import {Injectable} from '@nestjs/common';
import IDocumentStore from './IDocumentStore';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import DocumentsRevision from '../../entities/DocumentsRevision';
import {DocumentGroup, DocumentsRevisionStatus} from 'entities/Document';
import {ID} from 'entities/Common';
import Document from 'database/entities/Document';
import Courier from 'database/entities/Courier';

@Injectable()
export default class CourierStore implements IDocumentStore {
  constructor(
    @InjectRepository(Document)
    private readonly repository: Repository<Document>,
    @InjectRepository(DocumentsRevision)
    private readonly documentRevisionRepository: Repository<DocumentsRevision>,
    @InjectRepository(Courier)
    private readonly courierRepository: Repository<Courier>,
  ) {}

  async getDocuments(revisionId: string) {
    return this.repository.find({
      where: {revision: {id: revisionId}},
    });
  }

  async addDocument(revisionId: ID, file: {id: ID}, group: DocumentGroup) {
    const document = this.repository.create({
      file,
      group,
      revision: {id: revisionId},
    });
    this.repository.insert(document);
    return document;
  }

  async deleteDocument(id: string) {
    await this.repository.delete({id});
  }

  async findDocumentById(id: string) {
    return this.repository.findOne(id, {
      relations: ['revision', 'revision.courier'],
    });
  }

  async requestDocumentsRevisionVerification(
    revisionId: ID,
    status: DocumentsRevisionStatus.VerificationRequested,
  ) {
    await this.documentRevisionRepository.update(revisionId, {status});
  }

  async evaluateRevision(
    revisionId: ID,
    status:
      | DocumentsRevisionStatus.Approved
      | DocumentsRevisionStatus.ChangesRequested
      | DocumentsRevisionStatus.Rejected,
    comment: string,
  ) {
    await this.documentRevisionRepository.update(revisionId, {status, comment});
  }

  async createDocumentsRevisionIfNotExists(courierId: ID) {
    const courier = await this.courierRepository.findOneOrFail(courierId);
    if (!courier.revisionId) {
      const revision = this.documentRevisionRepository.create({
        status: DocumentsRevisionStatus.New,
        courier,
      });
      await this.documentRevisionRepository.insert(revision);

      await this.courierRepository.update(courierId, {revision});
    }
  }
}
