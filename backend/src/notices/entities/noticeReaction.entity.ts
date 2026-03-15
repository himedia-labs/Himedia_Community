import { CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from '../../auth/entities/user.entity';

import { Notice } from './notice.entity';

@Entity({ name: 'notice_reactions' })
@Index(['noticeId', 'createdAt'])
export class NoticeReaction {
  @PrimaryColumn({ name: 'notice_id', type: 'bigint' })
  noticeId!: string;

  @PrimaryColumn({ name: 'user_id', type: 'bigint' })
  userId!: string;

  @PrimaryColumn({ type: 'varchar', length: 16 })
  emoji!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Notice, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'notice_id' })
  notice!: Notice;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
