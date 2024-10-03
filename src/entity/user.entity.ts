import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column()
  passphrase: string;

  @Column()
  email: string;

  @Column()
  profile_image: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: 2 })
  permission: number;
}
