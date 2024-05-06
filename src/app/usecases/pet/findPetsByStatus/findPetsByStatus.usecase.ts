import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindPetsByStatusQuery } from './findPetsByStatus.query';
import { Inject } from '@nestjs/common';
import { PetRepository as PetRepositoryToken } from '../../../../domain/di.tokens';
import { PetRepository } from '../../../../domain/port/petRepository';
import { Pet } from '../../../../domain/entity/pet';
import { PetStatusEnum } from '../../../../api/openapi/types';

@QueryHandler(FindPetsByStatusQuery)
export default class FindPetsByStatusUseCase
  implements IQueryHandler<FindPetsByStatusQuery>
{
  constructor(
    @Inject(PetRepositoryToken)
    private readonly petRepository: PetRepository,
  ) {}

  async execute(query: FindPetsByStatusQuery): Promise<Pet[]> {
    const status = query.status || PetStatusEnum.Available;
    return this.petRepository.findPetByStatus(status);
  }
}
