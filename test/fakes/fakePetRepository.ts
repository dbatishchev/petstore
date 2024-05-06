import { PetRepository } from '../../src/domain/port/petRepository';
import { Pet } from '../../src/domain/entity/pet';

export class FakePetRepository implements PetRepository {
  private pets: Pet[];

  constructor() {
    this.pets = [];
  }

  async findPetByID(id: number): Promise<Pet | null> {
    const pet = this.pets.find((p) => p.id === id);
    return pet || null;
  }

  async create(pet: Omit<Pet, 'id'>): Promise<Pet> {
    const newPet: Pet = { ...pet, id: this.pets.length + 1 };
    this.pets.push(newPet);
    return newPet;
  }

  async deleteByID(id: number): Promise<void> {
    this.pets = this.pets.filter((p) => p.id !== id);
  }

  async findPetByStatus(status: string): Promise<Pet[]> {
    return this.pets.filter((p) => p.status === status);
  }

  async findPetsByTags(tagIDs: number[]): Promise<Pet[]> {
    const tagIDsSet = new Set(tagIDs);

    return this.pets.filter((p) => {
      for (const tag of p.tags) {
        if (tagIDsSet.has(tag.id)) {
          return true;
        }
      }
      return false;
    });
  }

  async update(pet: Pet): Promise<Pet> {
    const index = this.pets.findIndex((p) => p.id === pet.id);
    if (index !== -1) {
      this.pets[index] = pet;
      return pet;
    } else {
      throw new Error('Pet not found');
    }
  }

  async findAll(): Promise<Pet[]> {
    return this.pets;
  }

  clear(): void {
    this.pets = [];
  }
}
