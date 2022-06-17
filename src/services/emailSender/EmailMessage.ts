export default interface EmailMessage<TContext> {
  template: string;
  subject: string;
  context?: TContext;
}
