import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePetCommand } from './updatePet.command';
import { Inject } from '@nestjs/common';
import {
  CategoryRepository as CategoryRepositoryToken,
  PetRepository as PetRepositoryToken,
  TagRepository as TagRepositoryToken,
} from '../../../../domain/di.tokens';
import { PetRepository } from '../../../../domain/port/petRepository';
import { Category } from '../../../../domain/entity/category';
import { Tag } from '../../../../domain/entity/tag';
import { CategoryRepository } from '../../../../domain/port/categoryRepository';
import { TagRepository } from '../../../../domain/port/tagRepository';
import { Pet } from '../../../../domain/entity/pet';
import InvalidArgument from '../../../../common/error/invalidArgument';
import NotFound from '../../../../common/error/notFound';
import ImageService from '../../../service/imageService';

@CommandHandler(UpdatePetCommand)
export default class UpdatePetUseCase
  implements ICommandHandler<UpdatePetCommand>
{
  constructor(
    @Inject(PetRepositoryToken)
    private readonly petRepository: PetRepository,
    @Inject(CategoryRepositoryToken)
    private readonly categoryRepository: CategoryRepository,
    @Inject(TagRepositoryToken)
    private readonly tagRepository: TagRepository,
    private readonly imageService: ImageService,
  ) {}

  async execute(command: UpdatePetCommand): Promise<Pet> {
    const pet = await this.petRepository.findPetByID(command.pet.id);
    if (!pet) {
      throw new NotFound();
    }

    const category = await this.getCategory(
      command.pet?.category?.id,
      command.pet?.category?.name,
    );

    const tagIDs = command.pet.tags?.map((t) => t.id).filter(Boolean) || [];
    const tagNames = command.pet.tags?.map((t) => t.name).filter(Boolean) || [];
    const tags = await this.getTags(tagIDs, tagNames);
    const images = await this.imageService.getImagesFromPhotoURLs(
      command.pet.photoUrls,
    );

    pet.name = command.pet.name;
    pet.status = command.pet.status;
    pet.images = images;
    pet.category = category;
    pet.tags = tags;

    return this.petRepository.update(pet);
  }

  private async getCategory(
    id?: number,
    name?: string,
  ): Promise<Category | null> {
    if (id) {
      const category = await this.categoryRepository.findByID(id);
      if (!category) {
        throw new InvalidArgument();
      }
    }

    if (name) {
      return await this.categoryRepository.findByNameOrCreate(name);
    }

    return null;
  }

  private async getTags(tagsIDs: number[], tagNames: string[]): Promise<Tag[]> {
    const tags = await this.tagRepository.findByIDs(tagsIDs);
    if (tagsIDs.length !== tags.length) {
      throw new InvalidArgument('Invalid tags IDs');
    }

    const newTags = await Promise.all(
      ...[
        tagNames
          .filter((name) => !tags.find((t) => t.name === name))
          .map((name) => this.tagRepository.findOrByNameCreate(name)),
      ],
    );

    return [...tags, ...newTags];
  }
}
