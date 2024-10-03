import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'boolean', default: false })
  public_post: boolean;

  @Column({ type: 'varchar' })
  created_at: number;
}
