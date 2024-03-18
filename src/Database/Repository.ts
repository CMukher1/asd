/**
 * Imports AppDataSource and User entity from entities.
 * Gets userRepository instance from AppDataSource for User entity.
 * Exports userRepository instance.
 */
import AppDataSource from "./AppDataSource";
import { UserEntity } from "./entities/UserEntity.entitie";
import { RoleEntity } from "./entities/RoleEntity.entitie";
import { MenuEntity } from "./entities/MenuEntity.entitie";
import { EmployeeEntity } from "./entities/EmployeeEntity.entitie";

export const userRepository = AppDataSource.getRepository(UserEntity);
export const roleRepository = AppDataSource.getRepository(RoleEntity);
export const menuRepository = AppDataSource.getRepository(MenuEntity);
export const employeeRepository = AppDataSource.getRepository(EmployeeEntity);