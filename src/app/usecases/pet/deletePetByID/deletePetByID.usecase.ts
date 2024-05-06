import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePetByIDCommand } from './deletePetByID.command';
import { Inject } from '@nestjs/common';
import { PetRepository as PetRepositoryToken } from '../../../../domain/di.tokens';
import { PetRepository } from '../../../../domain/port/petRepository';
import NoContent from '../../../../common/error/noContent';

@CommandHandler(DeletePetByIDCommand)
export default class DeletePetByIDUseCase
  implements ICommandHandler<DeletePetByIDCommand>
{
  constructor(
    @Inject(PetRepositoryToken)
    private readonly petRepository: PetRepository,
  ) {}

  async execute(command: DeletePetByIDCommand): Promise<any> {
    const pet = await this.petRepository.findPetByID(command.id);
    if (!pet) {
      throw new NoContent();
    }

    await this.petRepository.deleteByID(command.id);
  }
}
