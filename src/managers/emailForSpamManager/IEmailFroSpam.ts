import CreateEmailForSpamRequest from 'graphql/entities/emailForSpam/CreateEmailForSpamRequest';
import EmailForSpam from 'entities/EmailForSpam';

export default abstract class IEmailForSpamManager {
  abstract createEmailForSpam(emailForSpam: CreateEmailForSpamRequest): Promise<void>;

  abstract getEmailsForSpam(): Promise<EmailForSpam[]>;
}
