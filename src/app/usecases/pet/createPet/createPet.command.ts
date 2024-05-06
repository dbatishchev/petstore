import { PetDTO } from '../../../dto/pet.dto';

export class CreatePetCommand {
  constructor(public readonly pet: PetDTO) {}
}
