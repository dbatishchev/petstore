export enum ImageType {
  S3 = 's3',
  Local = 'local',
  External = 'external',
}

export interface Image {
  id: number;
  filename: string;
  path: string;
  mime: string;
  type: ImageType;
  additionalMeta: string;
}
