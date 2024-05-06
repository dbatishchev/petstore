import { Tag } from '../../src/infra/typeorm/tag.orm';

export const generateTag = (partial: Partial<Tag> = {}) => {
  const tag = new Tag();
  tag.name = partial.name ?? 'Test Tag';
  // Add other properties as needed for your test cases
  return tag;
};