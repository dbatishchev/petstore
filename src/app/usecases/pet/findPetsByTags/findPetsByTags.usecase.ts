import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindPetsByTagsQuery } from './findPetsByTags.query';
import { Inject } from '@nestjs/common';
import {
  PetRepository as PetRepositoryToken,
  TagRepository as TagRepositoryToken,
} from '../../../../domain/di.tokens';
import { PetRepository } from '../../../../domain/port/petRepository';
import { Pet } from '../../../../domain/entity/pet';
import { TagRepository } from '../../../../domain/port/tagRepository';

@QueryHandler(FindPetsByTagsQuery)
export default class FindPetsByTagsUseCase
  implements IQueryHandler<FindPetsByTagsQuery>
{
  constructor(
    @Inject(PetRepositoryToken)
    private readonly petRepository: PetRepository,
    @Inject(TagRepositoryToken)
    private readonly tagRepository: TagRepository,
  ) {}

  async execute(query: FindPetsByTagsQuery): Promise<Pet[]> {
    if (query.tags.length === 0) {
      return this.petRepository.findAll();
    }

    const tags = await this.tagRepository.findByNames(query.tags);
    const tagIds = tags.map((tag) => tag.id);
    return this.petRepository.findPetsByTags(tagIds);
  }
}
