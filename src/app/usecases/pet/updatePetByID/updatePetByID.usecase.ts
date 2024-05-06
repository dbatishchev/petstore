import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePetByIDCommand } from './updatePetByID.command';
import { Inject } from '@nestjs/common';
import { PetRepository as PetRepositoryToken } from '../../../../domain/di.tokens';
import { PetRepository } from '../../../../domain/port/petRepository';
import NotFound from '../../../../common/error/notFound';

@CommandHandler(UpdatePetByIDCommand)
export default class UpdatePetByIDUseCase
  implements ICommandHandler<UpdatePetByIDCommand>
{
  constructor(
    @Inject(PetRepositoryToken)
    private readonly petRepository: PetRepository,
  ) {}

  async execute(command: UpdatePetByIDCommand): Promise<any> {
    const pet = await this.petRepository.findPetByID(command.id);
    if (!pet) {
      throw new NotFound();
    }

    pet.name = command.name ? command.name : pet.name;
    pet.status = command.status ? command.status : pet.status;

    return this.petRepository.update(pet);
  }
}
