import {ID} from 'entities/Common';

export enum DocumentGroup {
  EmploymentAgreement = 'employmentAgreement',
  DriversLicense = 'driversLicense',
}

export interface Document {
  id: ID;
  group: DocumentGroup;
  fileId: ID;
}

export enum EvaluateDocumentsRevisionType {
  Approve = 'Approve',
  RequestChanges = 'RequestChanges',
  Reject = 'Reject',
}

export enum DocumentsRevisionStatus {
  New = 'New',
  VerificationRequested = 'VerificationRequested',
  ChangesRequested = 'ChangesRequested',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface DocumentsRevision {
  id: ID;
  comment: string;
  status: DocumentsRevisionStatus;
}
