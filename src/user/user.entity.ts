import { Exclude, Expose } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ length: 50 })
  @Expose()
  username: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Expose()
  phone: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'], // 定义用户类型为枚举类型
    default: 'user',
  })
  @Expose()
  userType: 'admin' | 'user';
}
