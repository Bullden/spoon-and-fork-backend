import ILoginStore from './ILoginStore';
import User from '../../entities/User';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import LocalLogin from '../../entities/LocalLogin';
import {ID} from 'entities/Common';

export default class LoginStore extends ILoginStore {
  constructor(
    @InjectRepository(LocalLogin)
    private readonly repository: Repository<LocalLogin>,
  ) {
    super();
  }

  async createLocalLogin(user: User, email: string, passwordHash: string) {
    const login = this.repository.create({
      user,
      email,
      passwordHash,
    });
    await this.repository.insert(login);
    return login;
  }

  async getLocalLoginByEmail(email: string) {
    return this.repository
      .createQueryBuilder('ll')
      .where('LOWER(ll.email) = LOWER(:email)', {email})
      .innerJoinAndSelect('ll.user', 'u')
      .getOne();
  }

  getLocalLoginByUser(user: {id: ID}) {
    return this.repository.findOne({user: {id: user.id}}, {relations: ['user']});
  }

  async updateLocalLoginPassword(user: {id: string}, passwordHash: string) {
    await this.repository.update(user.id, {
      passwordHash,
    });
  }

  findLocalLoginByEmail(email: string) {
    return this.repository.findOne({where: {email}});
  }
}
