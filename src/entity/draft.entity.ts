import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'drafts' })
export class DraftEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'text' })
  text: string;

  @Column()
  created_at: number;
}
