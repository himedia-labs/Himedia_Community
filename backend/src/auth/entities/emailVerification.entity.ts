import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'email_verifications' })
@Index(['email'])
@Index(['code'])
@Index(['expiresAt'])
@Index(['email', 'code', 'used'])
export class EmailVerification {
  @PrimaryColumn({ type: 'bigint' })
  id!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ length: 255 })
  code!: string;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt!: Date;

  @Column({ type: 'boolean', default: false })
  used!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
