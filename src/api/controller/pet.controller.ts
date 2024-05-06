import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiResponse, Pet, PetStatusEnum } from '../openapi/types';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePetCommand } from '../../app/usecases/pet/createPet/createPet.command';
import { UpdatePetCommand } from '../../app/usecases/pet/updatePet/updatePet.command';
import { FindPetsByStatusQuery } from '../../app/usecases/pet/findPetsByStatus/findPetsByStatus.query';
import { FindPetsByTagsQuery } from '../../app/usecases/pet/findPetsByTags/findPetsByTags.query';
import { FindPetByIDQuery } from '../../app/usecases/pet/findPetByID/findPetByID.query';
import { UpdatePetByIDCommand } from '../../app/usecases/pet/updatePetByID/updatePetByID.command';
import { DeletePetByIDCommand } from '../../app/usecases/pet/deletePetByID/deletePetByID.command';
import { UploadPetImageCommand } from '../../app/usecases/pet/uploadPetImage/uploadPetImage.command';
import { PetMapper } from '../mapper/petMapper';
import { ValidatorPipe } from '../pipe/validation.pipe';
import { CreatePetReqSchema } from '../validation/createPetReq.schema';
import { UpdatePetReqSchema } from '../validation/updatePetReq.schema';
import { HttpExceptionFilter } from '../filter/httpException.filter';
import { FindPetByStatusQuerySchema } from '../validation/findPetByStatusQuery.schema';
import { UpdatePetByIDSchema } from '../validation/updatePetByID.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FindPetByTagsQuerySchema } from '../validation/findPetByTagsQuery.schema';

@Controller('pet')
@UseFilters(HttpExceptionFilter)
export class PetController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UsePipes(new ValidatorPipe<Pet>(CreatePetReqSchema))
  public async create(@Body() request: Pet): Promise<Pet> {
    const result = await this.commandBus.execute(
      new CreatePetCommand(PetMapper.toEventDTO(request)),
    );
    return PetMapper.fromDomain(result);
  }

  @Put()
  @UsePipes(new ValidatorPipe<Pet>(UpdatePetReqSchema))
  public async update(@Body() request: Pet): Promise<Pet> {
    const result = await this.commandBus.execute(
      new UpdatePetCommand(PetMapper.toEventDTO(request)),
    );
    return PetMapper.fromDomain(result);
  }

  @Get('/findByStatus')
  public async findByStatus(
    @Query(new ValidatorPipe(FindPetByStatusQuerySchema))
    { status }: { status: PetStatusEnum },
  ): Promise<Pet[]> {
    const result = await this.queryBus.execute(
      new FindPetsByStatusQuery(status),
    );
    return result.map(PetMapper.fromDomain);
  }

  @Get('/findByTags')
  public async findByTags(
    @Query(new ValidatorPipe(FindPetByTagsQuerySchema))
    { tags }: { tags: string[] | string },
  ): Promise<Pet[]> {
    if (typeof tags === 'string') {
      tags = [tags];
    }
    if (!Array.isArray(tags)) {
      tags = [];
    }
    const result = await this.queryBus.execute(new FindPetsByTagsQuery(tags));
    return result.map(PetMapper.fromDomain);
  }

  @Get('/:petId')
  public async findByID(
    @Param('petId', ParseIntPipe) petId: number,
  ): Promise<Pet> {
    const result = await this.queryBus.execute(new FindPetByIDQuery(petId));
    return PetMapper.fromDomain(result);
  }

  @Post('/:petId')
  @HttpCode(200)
  public async updateByID(
    @Param('petId', ParseIntPipe) petId: number,
    @Query(new ValidatorPipe(UpdatePetByIDSchema))
    { status, name }: { name: string; status: PetStatusEnum },
  ): Promise<Pet> {
    const result = await this.commandBus.execute(
      new UpdatePetByIDCommand(petId, name, status),
    );
    return PetMapper.fromDomain(result);
  }

  @Delete('/:petId')
  public async deleteByID(
    @Param('petId', ParseIntPipe) petId: number,
  ): Promise<void> {
    return await this.commandBus.execute(new DeletePetByIDCommand(petId));
  }

  @Post('/:petId/uploadImage')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  public async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 100000 })],
      }),
    )
    file: Express.Multer.File,
    @Param('petId', ParseIntPipe) petId: number,
    @Query('additionalMetadata') additionalMetadata: string,
  ): Promise<ApiResponse> {
    await this.commandBus.execute(
      new UploadPetImageCommand(petId, additionalMetadata, file),
    );

    return {
      code: 200,
      type: 'success',
      message: 'File uploaded successfully!',
    };
  }
}
