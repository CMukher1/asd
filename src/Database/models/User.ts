import { UserEntity } from "../entities/UserEntity.entitie";

export interface IUser {
  username: string;
  password: string;
  email: string;
}

export interface IUserRepository {
     get(): Promise<UserEntity[] | null>;
     getById(id: number): Promise<UserEntity | null>;
     add(user: UserEntity): Promise<UserEntity | null>;
     delete(id: number): Promise<UserEntity | null>;
}