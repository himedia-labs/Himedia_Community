import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { BlogFeed } from './blogFeed.entity';

/**
 * 블로그 수집 항목
 * @description RSS 피드에서 수집한 개별 블로그 글 정보
 */
@Entity({ name: 'blog_entries' })
@Index(['publishedAt'])
export class BlogEntry {
  @PrimaryColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'feed_id', type: 'bigint' })
  feedId!: string;

  @ManyToOne(() => BlogFeed)
  @JoinColumn({ name: 'feed_id' })
  feed!: BlogFeed;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'varchar', length: 1000, unique: true })
  url!: string;

  @Column({ name: 'published_at', type: 'timestamp' })
  publishedAt!: Date;

  @Column({ type: 'integer', default: 0 })
  views!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
