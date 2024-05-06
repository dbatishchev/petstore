import { PetStatusEnum } from '../../../../api/openapi/types';

export class UpdatePetByIDCommand {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly status: PetStatusEnum,
  ) {}
}
