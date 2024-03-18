import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from './UserEntity.entitie';

@Entity('m_employee')
@Unique(["user"])
export class EmployeeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'date' })
  dateOfBirth!: Date;

  @Column({ type: 'char', length: 4 })
  gender!: string;

  @Column({ type: 'varchar', length: 36 })
  jobTitle!: string;

  @Column({ type: 'varchar', length: 36 })
  department!: string;

  @Column({ type: 'int' })
  salary!: number;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'varchar', length: 36 })
  manager!: string;

  @Column({ type: 'varchar', length: 36 })
  peopleManager!: string;

  // @ManyToOne(() => UserEntity, (user) => user.id)
  // @JoinTable()
  // user!: UserEntity;
  // userID as a foreign key linking to the user entity
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @CreateDateColumn()
  create_ts!: Date;

  @UpdateDateColumn()
  update_ts!: Date;

  @Column({ type: "uuid" })
  created_by!: string;

  @Column({ type: "uuid" })
  updated_by!: string;
}