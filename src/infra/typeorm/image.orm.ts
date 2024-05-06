import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ImageType } from '../../domain/entity/image';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128, nullable: false })
  filename: string;

  @Column({ length: 128, nullable: false })
  path: string;

  @Column({ length: 64, nullable: false })
  mime: string;

  @Column({ length: 64, nullable: false })
  type: ImageType;

  @Column('text')
  additionalMeta: string;
}
