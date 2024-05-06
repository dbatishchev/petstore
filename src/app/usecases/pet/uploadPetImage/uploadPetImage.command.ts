export class UploadPetImageCommand {
  constructor(
    public readonly id: number,
    public readonly additionalMeta: string,
    public readonly file: Express.Multer.File,
  ) {}
}
