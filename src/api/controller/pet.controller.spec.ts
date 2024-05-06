import { Test, TestingModule } from '@nestjs/testing';
import { PetController } from './pet.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Pet, PetStatusEnum } from '../openapi/types';
import { PetMapper } from '../mapper/petMapper';
import { CreatePetCommand } from '../../app/usecases/pet/createPet/createPet.command';
import { FindPetsByStatusQuery } from '../../app/usecases/pet/findPetsByStatus/findPetsByStatus.query';
import { UploadPetImageCommand } from '../../app/usecases/pet/uploadPetImage/uploadPetImage.command';
import { DeletePetByIDCommand } from '../../app/usecases/pet/deletePetByID/deletePetByID.command';
import { UpdatePetByIDCommand } from '../../app/usecases/pet/updatePetByID/updatePetByID.command';
import { FindPetByIDQuery } from '../../app/usecases/pet/findPetByID/findPetByID.query';
import { FindPetsByTagsQuery } from '../../app/usecases/pet/findPetsByTags/findPetsByTags.query';
import { UpdatePetCommand } from '../../app/usecases/pet/updatePet/updatePet.command';
import { generatePet } from '../../../test/generator/generatePet';

describe('PetController', () => {
  let controller: PetController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandBus, QueryBus],
      controllers: [PetController],
    }).compile();

    controller = module.get<PetController>(PetController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a pet', async () => {
      const pet: Pet = {
        id: 1,
        name: 'doggie',
        photoUrls: ['url'],
        status: PetStatusEnum.Available,
      };
      const createPetCommand = new CreatePetCommand(PetMapper.toEventDTO(pet));

      jest.spyOn(commandBus, 'execute').mockResolvedValue(generatePet());

      await controller.create(pet);
      expect(commandBus.execute).toHaveBeenCalledWith(createPetCommand);
    });
  });

  describe('update', () => {
    it('should update a pet', async () => {
      const pet: Pet = {
        id: 1,
        name: 'doggie',
        photoUrls: ['url'],
        status: PetStatusEnum.Available,
      };
      const updatePetCommand = new UpdatePetCommand(PetMapper.toEventDTO(pet));

      jest.spyOn(commandBus, 'execute').mockResolvedValue(generatePet());

      await controller.update(pet);
      expect(commandBus.execute).toHaveBeenCalledWith(updatePetCommand);
    });
  });

  describe('findByStatus', () => {
    it('should find pets by status', async () => {
      const status = PetStatusEnum.Available;
      const findPetsByStatusQuery = new FindPetsByStatusQuery(status);

      jest.spyOn(queryBus, 'execute').mockResolvedValue([generatePet()]);

      await controller.findByStatus({ status });
      expect(queryBus.execute).toHaveBeenCalledWith(findPetsByStatusQuery);
    });
  });

  describe('findByTags', () => {
    it('should find pets by tags', async () => {
      const tags: string[] = ['tag1', 'tag2'];
      const findPetsByTagsQuery = new FindPetsByTagsQuery(tags);

      jest.spyOn(queryBus, 'execute').mockResolvedValue([generatePet()]);

      await controller.findByTags({ tags });
      expect(queryBus.execute).toHaveBeenCalledWith(findPetsByTagsQuery);
    });
  });

  describe('findByID', () => {
    it('should find a pet by ID', async () => {
      const petId = 1;
      const findPetByIDQuery = new FindPetByIDQuery(petId);

      jest.spyOn(queryBus, 'execute').mockResolvedValue(generatePet());

      await controller.findByID(petId);
      expect(queryBus.execute).toHaveBeenCalledWith(findPetByIDQuery);
    });
  });

  describe('updateByID', () => {
    it('should update a pet by ID', async () => {
      const petId = 1;
      jest.spyOn(commandBus, 'execute').mockResolvedValue(generatePet());

      await controller.updateByID(petId, {
        name: 'doggie-new-name',
        status: PetStatusEnum.Sold,
      });
      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdatePetByIDCommand(petId, 'doggie-new-name', PetStatusEnum.Sold),
      );
    });
  });

  describe('deleteByID', () => {
    it('should delete a pet by ID', async () => {
      const petId = 1;
      const deletePetByIDCommand = new DeletePetByIDCommand(petId);

      jest.spyOn(commandBus, 'execute').mockResolvedValue(undefined);

      await controller.deleteByID(petId);
      expect(commandBus.execute).toHaveBeenCalledWith(deletePetByIDCommand);
    });
  });

  describe('uploadImage', () => {
    it('should upload an image for a pet', async () => {
      const petId = 1;
      const file = {} as Express.Multer.File;
      const additionalMetadata = 'metadata';

      const uploadPetImageCommand = new UploadPetImageCommand(
        petId,
        additionalMetadata,
        file,
      );
      jest.spyOn(commandBus, 'execute').mockResolvedValue(undefined);

      await controller.uploadImage(file, petId, additionalMetadata);
      expect(commandBus.execute).toHaveBeenCalledWith(uploadPetImageCommand);
    });
  });
});
