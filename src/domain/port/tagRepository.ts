import { Tag } from '../entity/tag';

export interface TagRepository {
  findByNames(names: string[]): Promise<Tag[]>;
  findByIDs(ids: number[]): Promise<Tag[]>;
  findOrByNameCreate(name: string): Promise<Tag>;
}
