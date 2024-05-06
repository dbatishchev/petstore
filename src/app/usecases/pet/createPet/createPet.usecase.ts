import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePetCommand } from './createPet.command';
import { Inject } from '@nestjs/common';
import {
  CategoryRepository as CategoryRepositoryToken,
  PetRepository as PetRepositoryToken,
  TagRepository as TagRepositoryToken,
} from '../../../../domain/di.tokens';
import { PetRepository } from '../../../../domain/port/petRepository';
import { Pet } from '../../../../domain/entity/pet';
import { CategoryRepository } from '../../../../domain/port/categoryRepository';
import { Category } from '../../../../domain/entity/category';
import { TagRepository } from '../../../../domain/port/tagRepository';
import { Tag } from '../../../../domain/entity/tag';
import { PetStatusEnum } from '../../../../api/openapi/types';
import InvalidArgument from '../../../../common/error/invalidArgument';
import ImageService from '../../../service/imageService';

@CommandHandler(CreatePetCommand)
export default class CreatePetUseCase
  implements ICommandHandler<CreatePetCommand>
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

  async execute(command: CreatePetCommand): Promise<Pet> {
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

    return await this.petRepository.create({
      name: command.pet.name,
      category: category,
      images: images,
      tags: tags,
      status: command.pet.status || PetStatusEnum.Available,
    });
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
