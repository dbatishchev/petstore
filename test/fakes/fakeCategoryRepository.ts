import { CategoryRepository } from '../../src/domain/port/categoryRepository';
import { Category } from '../../src/domain/entity/category';

export class FakeCategoryRepository implements CategoryRepository {
  private categories: Category[];

  constructor() {
    this.categories = [];
  }

  async findByID(id: number): Promise<Category | null> {
    const category = this.categories.find((c) => c.id === id);
    return category || null;
  }

  async findByNameOrCreate(name: string): Promise<Category> {
    let category = this.categories.find((c) => c.name === name);

    if (!category) {
      // If category doesn't exist, create a new one
      const newCategory: Category = { id: this.categories.length + 1, name };
      this.categories.push(newCategory);
      category = newCategory;
    }

    return category;
  }

  create(category: Category): void {
    this.categories.push(category);
  }

  createMany(categories: Category[]): void {
    this.categories.push(...categories);
  }

  clear(): void {
    this.categories = [];
  }
}
