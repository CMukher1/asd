import { userRepository } from "../Repository";
import { MenuEntity } from "../entities/MenuEntity.entitie";
import { RoleEntity } from "../entities/RoleEntity.entitie";

export type DynamicUserInterface = Record<string, any>;

export const getUserDetails = async (id: string) => {
  if (!id) return {};
  const selectColumns = userRepository.metadata.columns
    .map((column) => `user.${column.propertyName}`)
    .filter((column) => column !== "user.password");

  const userDetails = await userRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.roles", "roles")
    .leftJoinAndSelect("roles.menus", "menus")
    .select([...selectColumns, "roles", "menus"])
    .where("user.id = :id", { id })
    .getOne();

  const user = {
    ...userDetails,
    displayName: `${userDetails?.firstname} ${userDetails?.lastname}`,
    roles: undefined,
  };

  const roles = userDetails?.roles as RoleEntity[];

  const menus = roles.flatMap((role) => role.menus) as MenuEntity[];
  const menuGroups: Record<string, MenuEntity[]> = menus.reduce(
    (acc: Record<string, MenuEntity[]>, item) => {
      let { group_name } = item;
      // If group_name is null or undefined, assign it to a default group
      if (!group_name) {
        group_name = "Default";
      }
      // Ensure acc is initialized as an object if it's undefined
      if (!acc[group_name]) {
        acc[group_name] = [];
      }
      acc[group_name].push(item);
      return acc;
    },
    {}
  );

  return {
    menus: menuGroups,
    roles: roles.map(({ menus, ...role }) => role),
    userDetails: user as DynamicUserInterface,
  };
};
