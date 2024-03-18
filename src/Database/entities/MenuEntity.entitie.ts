import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable,
} from "typeorm";
import { RoleEntity } from "./RoleEntity.entitie";

@Entity("m_menu")
export class MenuEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  display_text!: string;

  @Column({ type: "varchar" })
  pathKey!: string;

  @Column({ type: "varchar", nullable: true })
  group_name!: string | null;

  @Column({ type: "varchar", nullable: true })
  icon!: string | null;

  // Many-to-many relationship with roles
  @ManyToMany(() => RoleEntity, (role) => role.menus)
  @JoinTable()
  roles!: RoleEntity[];

  // Self-referencing relationship for children menus
  @OneToMany(() => MenuEntity, (menu) => menu.parent)
  children?: MenuEntity[];

  @ManyToOne(() => MenuEntity, (menu) => menu.children)
  @JoinColumn({ name: "parent_id" })
  parent?: MenuEntity;

  @CreateDateColumn({ type: "timestamp" })
  create_ts!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  update_ts!: Date;

  @Column({ type: "uuid" })
  created_by!: string;

  @Column({ type: "uuid" })
  updated_by!: string;
}
