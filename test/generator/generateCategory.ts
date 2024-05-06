import { Category } from '../../src/infra/typeorm/category.orm';

export const generateCategory = (partial: Partial<Category> = {}) => {
  const category = new Category();
  category.name = partial.name ?? 'Test Category';
  return category;
};
