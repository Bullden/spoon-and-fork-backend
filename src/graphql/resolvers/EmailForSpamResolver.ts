import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import EmailForSpamRequest from 'graphql/entities/emailForSpam/CreateEmailForSpamRequest';
import IEmailFroSpamManager from '../../managers/emailForSpamManager/IEmailFroSpam';
import Ignore from 'enhancers/decorators/Ignore';
import EmailForSpam from 'graphql/entities/emailForSpam/EmailForSpam';
import Roles from 'enhancers/decorators/Roles';

@Resolver()
export class EmailForSpamResolver {
  constructor(private readonly emailFroSpamManager: IEmailFroSpamManager) {}

  @Mutation(() => Boolean)
  @Ignore('Authorization')
  async createEmailForSpam(@Args('email') email: EmailForSpamRequest) {
    await this.emailFroSpamManager.createEmailForSpam(email);
    return true;
  }

  @Query(() => [EmailForSpam])
  @Roles('Client')
  async getEmailsForSpam() {
    return this.emailFroSpamManager.getEmailsForSpam();
    // const test = await this.addressManager.getClientOrdersAddresses(userId);
    // console.log(test);
    // return test;
  }
}
