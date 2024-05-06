import { PipeTransform, BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';

export class ValidatorPipe<Dto> implements PipeTransform<Dto> {
  constructor(private schema: Joi.ObjectSchema<any> | Joi.ArraySchema) {}
  public transform(value: Dto): Dto {
    const result = this.schema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}
