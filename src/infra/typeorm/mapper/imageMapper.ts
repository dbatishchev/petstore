import { Image as ImagePersistenceModel } from '../image.orm';
import { Image } from '../../../domain/entity/image';
import { Pet } from '../../../domain/entity/pet';

export class ImageMapper {
  static toDomain(i: ImagePersistenceModel): Image {
    return {
      id: i.id,
      filename: i.filename,
      mime: i.mime,
      type: i.type,
      additionalMeta: i.additionalMeta,
      path: i.path,
    };
  }

  static toPersistence(i: PartialBy<Image, 'id'>): ImagePersistenceModel {
    const imagePersistenceModel = new ImagePersistenceModel();
    imagePersistenceModel.id = i.id;
    imagePersistenceModel.filename = i.filename;
    imagePersistenceModel.mime = i.mime;
    imagePersistenceModel.type = i.type;
    imagePersistenceModel.additionalMeta = i.additionalMeta;
    imagePersistenceModel.path = i.path;
    return imagePersistenceModel;
  }
}
