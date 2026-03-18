import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { BlogEntry } from './blogEntry.entity';

/**
 * 블로그 피드 소스
 * @description RSS 피드를 제공하는 기술 블로그 소스 정보
 */
@Entity({ name: 'blog_feeds' })
export class BlogFeed {
  @PrimaryColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 200, unique: true })
  domain!: string;

  @Column({ name: 'feed_url', type: 'varchar', length: 500 })
  feedUrl!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => BlogEntry, entry => entry.feed)
  entries!: BlogEntry[];
}
