import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  user_id: string;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  preview: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'boolean', default: false })
  public_post: boolean;

  @Column({ type: 'varchar' })
  created_at: number;

  @Column({ type: 'varchar', default: '0' })
  edited_at?: number;
}
