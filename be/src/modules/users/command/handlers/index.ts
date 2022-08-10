import { AddOwnerHandler } from '@modules/users/command/handlers/addOwner.handler';
import { AddWorkerHandler } from '@modules/users/command/handlers/addWorker.handler';

export const userCommandHandlers = [AddOwnerHandler, AddWorkerHandler];
