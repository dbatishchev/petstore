import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.orm';
import { Tag } from './tag.orm';
import { PetStatusEnum } from '../../api/openapi/types';
import { Order } from './order.orm';
import { Image } from './image.orm';

@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, nullable: false })
  name: string;

  @ManyToOne(() => Category, { cascade: true, eager: true })
  category: Category;

  @ManyToMany(() => Tag, { cascade: true, onDelete: 'CASCADE', eager: true })
  @JoinTable()
  tags: Tag[];

  @Column({ length: 64, nullable: false })
  status: PetStatusEnum;

  @OneToMany(() => Order, (order) => order.pet, { eager: false })
  orders: Order[];

  @ManyToMany(() => Image, { eager: true })
  @JoinTable()
  images: Image[];
}
