import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadPetImageCommand } from './uploadPetImage.command';
import { Inject } from '@nestjs/common';
import {
  PetRepository as PetRepositoryToken,
  ImageRepository as ImageRepositoryToken,
} from '../../../../domain/di.tokens';
import { PetRepository } from '../../../../domain/port/petRepository';
import { ImageRepository } from '../../../../domain/port/imageRepository';
import NoContent from '../../../../common/error/noContent';
import { ImageType } from '../../../../domain/entity/image';

@CommandHandler(UploadPetImageCommand)
export default class UploadPetImageUseCase
  implements ICommandHandler<UploadPetImageCommand>
{
  constructor(
    @Inject(PetRepositoryToken)
    private readonly petRepository: PetRepository,

    @Inject(ImageRepositoryToken)
    private readonly imageRepository: ImageRepository,
  ) {}

  async execute(command: UploadPetImageCommand): Promise<any> {
    const pet = await this.petRepository.findPetByID(command.id);
    if (!pet) {
      throw new NoContent();
    }

    const image = await this.imageRepository.create({
      filename: command.file.filename,
      path: command.file.path,
      mime: command.file.mimetype,
      type: ImageType.Local,
      additionalMeta: command.additionalMeta,
    });

    pet.images.push(image);

    await this.petRepository.update(pet);

    return Promise.resolve();
  }
}
