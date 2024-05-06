import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, nullable: false, unique: true })
  username: string;

  @Column({ length: 64, nullable: true })
  firstName: string;

  @Column({ length: 64, nullable: true })
  lastName: string;

  @Column({ length: 64, nullable: false })
  email: string;

  @Column({ length: 128, nullable: true })
  password: string;

  @Column({ length: 64, nullable: true })
  phone: string;

  @Column({ type: 'int', nullable: false, default: 1 })
  userStatus: number;

  // encode user password before saving to database
}
