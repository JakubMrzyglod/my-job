import { ObjectLiteral, Repository } from 'typeorm';

export abstract class BaseRepository<
  Entity extends ObjectLiteral,
> extends Repository<Entity> {
  abstract getRandomData(): Entity;

  async createRandomOne(customEntityDetails: Partial<Entity>) {
    const entity = this.create({
      ...this.getRandomData(),
      ...customEntityDetails,
    });
    await this.insert(entity);
    return entity;
  }
}
