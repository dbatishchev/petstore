import { PetDTO } from '../../../dto/pet.dto';

export class UpdatePetCommand {
  constructor(public readonly pet: PetDTO) {}
}
