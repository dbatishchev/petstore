import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindPetByIDQuery } from './findPetByID.query';
import { Inject } from '@nestjs/common';
import { PetRepository as PetRepositoryToken } from '../../../../domain/di.tokens';
import { PetRepository } from '../../../../domain/port/petRepository';
import NotFound from '../../../../common/error/notFound';
import { Pet } from '../../../../domain/entity/pet';

@QueryHandler(FindPetByIDQuery)
export default class FindPetByIDUseCase
  implements IQueryHandler<FindPetByIDQuery>
{
  constructor(
    @Inject(PetRepositoryToken)
    private readonly petRepository: PetRepository,
  ) {}

  async execute(query: FindPetByIDQuery): Promise<Pet> {
    const pet = await this.petRepository.findPetByID(query.id);
    if (!pet) {
      throw new NotFound();
    }

    return pet;
  }
}
