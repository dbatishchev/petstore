import { Pet } from '../entity/pet';

export interface PetRepository {
  findPetByID(id: number): Promise<Pet | null>;
  create(pet: Omit<Pet, 'id'>): Promise<Pet>;
  deleteByID(id: number): Promise<void>;
  findPetByStatus(status: string): Promise<Pet[]>;
  findPetsByTags(tagIDs: number[]): Promise<Pet[]>;
  update(pet: Pet): Promise<Pet>;
  findAll(): Promise<Pet[]>;
}
