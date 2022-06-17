import EmailMessage from './EmailMessage';

export abstract class IEmailSenderService {
  abstract sendMessage<TContext>(
    email: string,
    message: EmailMessage<TContext>,
  ): Promise<void>;
}
