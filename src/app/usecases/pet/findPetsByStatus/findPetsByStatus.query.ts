import { PetStatusEnum } from '../../../../api/openapi/types';

export class FindPetsByStatusQuery {
  constructor(public readonly status: PetStatusEnum) {}
}
