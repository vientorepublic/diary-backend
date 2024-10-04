import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'drafts' })
export class DraftEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  user_id: string;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'varchar' })
  modified_at: number;
}
