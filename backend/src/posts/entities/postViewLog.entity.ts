import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'post_view_logs' })
@Index(['postId', 'anonymousId', 'ip', 'userAgent', 'createdAt'])
export class PostViewLog {
  @PrimaryColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'post_id', type: 'bigint' })
  postId!: string;

  @Column({ name: 'anonymous_id', type: 'varchar', length: 64, nullable: true })
  anonymousId!: string;

  @Column({ type: 'varchar', length: 64 })
  ip!: string;

  @Column({ name: 'user_agent', type: 'varchar', length: 255 })
  userAgent!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
