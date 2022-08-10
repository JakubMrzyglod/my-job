import {
  ConflictException,
  INestApplication,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async tryOfFail(fn: Promise<any>, message: string) {
    try {
      return await fn;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ConflictException(message);
      }
    }
  }
}
