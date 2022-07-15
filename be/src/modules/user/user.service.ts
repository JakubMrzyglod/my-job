import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { ConfigurationValidationSchema } from '@config/validation/schema';
import { AuthConfigurationValidationSchema } from '@config/validation/schema/auth';
import { PrismaService } from '@prisma';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService<ConfigurationValidationSchema>,
    private readonly prisma: PrismaService,
  ) {}

  async findUserByEmailAndPassword(email: string, password: string) {
    const hashedPassword = this.hashPassword(password);
    const user = await this.prisma.user.findFirst({
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
