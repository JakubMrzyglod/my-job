import { Role } from '@prisma/client';

export type ReqUser = {
  id: number;
  orgs: { id: number; role: Role }[];
};
