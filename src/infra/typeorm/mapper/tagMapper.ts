import { Tag as TagPersistenceModel } from '../tag.orm';
import { Tag } from '../../../domain/entity/tag';

export class TagMapper {
  static toDomain(c: TagPersistenceModel): Tag {
    return {
      id: c.id,
      name: c.name,
    };
  }

  static toPersistence(c: Tag): TagPersistenceModel {
    const p = new TagPersistenceModel();
    p.id = c.id;
    p.name = c.name;
    return p;
  }
}
