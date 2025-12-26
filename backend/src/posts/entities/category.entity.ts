import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Post } from './post.entity';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryColumn({ type: 'bigint' })
  id!: string;

  @Column({ length: 50, unique: true })
  name!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => Post, post => post.category)
  posts!: Post[];
}
