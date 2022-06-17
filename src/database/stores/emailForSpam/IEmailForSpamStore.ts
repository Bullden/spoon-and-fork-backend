import EmailsForSpam from 'database/entities/EmailsForSpam';

export default abstract class IEmailForSpamStore {
  abstract createEmailForSpam(email: {
    email: string;
    isDiscount: boolean;
  }): Promise<EmailsForSpam>;

  abstract getEmails(): Promise<EmailsForSpam[]>;
}
