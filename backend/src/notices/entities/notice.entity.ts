import { Check, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { NoticeReaction } from './noticeReaction.entity';

export enum NoticeType {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  UPDATE = 'UPDATE',
}

@Check('notices_type_check', "\"type\" IN ('ANNOUNCEMENT', 'UPDATE')")
@Entity({ name: 'notices' })
@Index(['type', 'publishedAt'])
export class Notice {
  @PrimaryColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 20 })
  type!: NoticeType;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  version!: string | null;

  @Column({ name: 'admin_name', type: 'varchar', length: 100, nullable: true })
  adminName!: string | null;

  @Column({ name: 'admin_initial', type: 'varchar', length: 10, nullable: true })
  adminInitial!: string | null;

  @Column({ name: 'release_type', type: 'varchar', length: 50, nullable: true })
  releaseType!: string | null;

  @Column({ name: 'release_scope', type: 'varchar', length: 100, nullable: true })
  releaseScope!: string | null;

  @Column({ name: 'markdown_content', type: 'text', nullable: true })
  markdownContent!: string | null;

  @Column({ name: 'published_at', type: 'timestamp' })
  publishedAt!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => NoticeReaction, reaction => reaction.notice)
  reactions!: NoticeReaction[];
}
