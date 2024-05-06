import { Category as CategoryPersistenceModel } from '../category.orm';
import { Category } from '../../../domain/entity/category';

export class CategoryMapper {
  static toDomain(c: CategoryPersistenceModel): Category {
    return {
      id: c.id,
      name: c.name,
    };
  }

  static toPersistence(c: Category): CategoryPersistenceModel {
    const p = new CategoryPersistenceModel();
    p.id = c.id;
    p.name = c.name;
    return p;
  }
}
