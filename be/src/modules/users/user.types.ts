import { User } from '@prisma/client';

export type WorkerRelationDetails = {
  organizationId: number;
  scheduleId: number;
};

export type OwnerDetails = Omit<
  User,
  'id' | 'scheduleId' | 'hashedPassword'
> & {
  password: string;
};
