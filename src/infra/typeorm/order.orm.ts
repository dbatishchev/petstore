import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pet } from './pet.orm';
import { OrderStatusEnum } from '../../api/openapi/types';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pet, (pet) => pet.orders, { eager: true, nullable: false })
  pet: Pet;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: Date, nullable: false })
  shipDate: Date;

  @Column({ nullable: false })
  status: OrderStatusEnum;

  @Column({ type: 'boolean', nullable: false })
  complete: boolean;
}
