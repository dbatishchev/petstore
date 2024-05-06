import { TagRepository } from '../../src/domain/port/tagRepository';
import { Tag } from '../../src/domain/entity/tag';

export class FakeTagRepository implements TagRepository {
  private tags: Tag[];

  constructor() {
    this.tags = [];
  }

  async findByNames(names: string[]): Promise<Tag[]> {
    return this.tags.filter((tag) => names.includes(tag.name));
  }

  async findByIDs(ids: number[]): Promise<Tag[]> {
    return this.tags.filter((tag) => ids.includes(tag.id));
  }

  async findOrByNameCreate(name: string): Promise<Tag> {
    let tag = this.tags.find((t) => t.name === name);

    if (!tag) {
      // If tag doesn't exist, create a new one
      tag = { id: this.tags.length + 1, name };
      this.tags.push(tag);
    }

    return tag;
  }

  create(tag: Tag): void {
    this.tags.push(tag);
  }

  createMany(tags: Tag[]): void {
    this.tags.push(...tags);
  }

  clear(): void {
    this.tags = [];
  }
}
