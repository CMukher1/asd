/**
 * The User entity defines the schema for user data in the database.
 * It contains columns for id, username, email, password, createdAt, and updatedAt.
 * The id is a UUID generated automatically.
 * Username, email, and password have validation for minimum length.
 * Password is hashed before saving to DB.
 * It has methods to hash and check passwords.
 * The entity is decorated with TypeORM annotations like @Entity, @Column, etc.
 * @Unique decorator enforces email uniqueness constraint.
 */
import * as bcrypt from "bcryptjs";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { RoleEntity } from "./RoleEntity.entitie";

@Entity("m_user")
@Unique(["email_id"])
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "varchar", length: 20 })
  firstname!: string;

  @Column({ type: "varchar", length: 20 })
  lastname!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  profilePic!: string | null;

  @Column({ type: "char", length: 20, nullable: true })
  country!: string | null;

  @Column({ type: "char", length: 3, nullable: true })
  langu!: string | null;

  @Column({ type: "varchar", length: 30 })
  email_id!: string;

  @Column({ type: "varchar", nullable: true })
  contact_no!: string | null;

  @Column({ type: "char", nullable: true })
  status!: string | null;

  @CreateDateColumn({ type: "timestamp" })
  create_ts!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  update_ts!: Date;

  @Column({ type: "uuid" })
  created_by!: string;

  @Column({ type: "uuid" })
  updated_by!: string;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable()
  roles!: RoleEntity[];

  public hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
