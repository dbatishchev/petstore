import { Category } from '../entity/category';

export interface CategoryRepository {
  findByID(id: number): Promise<Category | null>;
  findByNameOrCreate(name: string): Promise<Category>;
}
