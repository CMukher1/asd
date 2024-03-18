// Import necessary modules from TypeORM
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./UserEntity.entitie";
import { MenuEntity } from "./MenuEntity.entitie";

// Define the entity class with the corresponding columns and data types
@Entity("m_role")
export class RoleEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 200 })
  role_key!: string | "";

  @Column({ type: "varchar", length: 200 })
  role_desc!: string;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users!: UserEntity[];

  @ManyToMany(() => MenuEntity, (menu) => menu.roles)
  menus!: MenuEntity[];

  @CreateDateColumn({ type: "timestamp" })
  create_ts!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  update_ts!: Date;

  @Column({ type: "uuid" })
  created_by!: string;

  @Column({ type: "uuid" })
  updated_by!: string;
}
