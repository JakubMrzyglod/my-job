import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { ConfigurationValidationSchema } from '@config/validation/schema';
import { AuthConfigurationValidationSchema } from '@config/validation/schema/auth';
import { User } from '@modules/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService<ConfigurationValidationSchema>,
  ) {}

  async findUserByEmailAndPassword(email: string, password: string) {
    const hashedPassword = this.hashPassword(password);
    const user = await this.usersRepository.findOne({
      where: { email, hashedPassword },
    });
    return user;
  }

  private hashPassword(password: string) {
    const { passwordSalt } =
      this.configService.get<AuthConfigurationValidationSchema>('auth');

    const hashedPassword = crypto
      .createHmac('sha256', passwordSalt)
      .update(password)
      .digest('hex');

    return hashedPassword;
  }
}
