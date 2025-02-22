import { Expose } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ length: 100 })
  @Expose()
  name: string;

  @Column({ type: 'text', nullable: true })
  @Expose()
  description: string;

  @Column({
    type: 'enum',
    enum: ['blog', 'note', 'project', 'contract'], // 定义文档类型为枚举类型
    default: 'note',
  })
  @Expose()
  docType: 'blog' | 'note' | 'project' | 'contract';
}
