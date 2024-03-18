// import { CreateClientDto } from "@/DTO/CreateClientDTO";
import {  menuRepository, roleRepository } from "@/Database/Repository";
// import { ClientEntity } from "@/Database/entities/ClientEntity.entitie";
import { MenuEntity } from "@/Database/entities/MenuEntity.entitie";
import { RoleEntity } from "@/Database/entities/RoleEntity.entitie";
import { DynamicUserInterface } from "@/Database/services/UserService";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import express, { Request, Response, NextFunction } from "express";
import { In } from "typeorm";
import { v4 } from "uuid";

const router = express.Router();

router.post("/createRole", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      body: { role_key, role_desc },
      user,
    } = req;
    const { id } = user as DynamicUserInterface;
    if (!role_key || !role_desc) {
      return res.status(400).json({
        status: "Error",
        message: "Role Key and Role Description are required",
      });
    }
    const roleObj = new RoleEntity();
    roleObj.role_key = role_key;
    roleObj.role_desc = role_desc;
    roleObj.created_by = id;
    roleObj.updated_by = id;
    // roleObj.created_by = '123';
    // roleObj.updated_by = '123';

    console.log(`roleObj`,roleObj);
    const role = await roleRepository.save(roleObj);

    return res.status(200).json({
      status: "Success",
      message: "Role is created successfully",
      data: role,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err,
    });
  }
});

router.post("/createMenu", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      body: { display_text, pathKey, group_name, role_ids },
      user,
    } = req;
    const { id } = user as DynamicUserInterface;

    const roles = await roleRepository.find({ where: { id: In(role_ids) } });
    if (roles.length === 0) {
      return res.status(400).json({
        status: "Error",
        message: "Role not found",
      });
    }

    const parentMenu = new MenuEntity();
    parentMenu.id = v4();
    parentMenu.display_text = display_text;
    parentMenu.pathKey = pathKey;
    parentMenu.created_by = id;
    parentMenu.updated_by = id;
    parentMenu.roles = roles;
    if (group_name) {
      parentMenu.group_name = group_name;
    }
    // Set other properties as needed

    const menuParent = await menuRepository.save(parentMenu);

    return res.status(200).json({
      status: "Success",
      message: "Role is created successfully",
      data: menuParent,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/getConfigs", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rolesPromiss = roleRepository.find();
    const menusPromiss = menuRepository.find();
    const [roles, menus] = await Promise.all([rolesPromiss, menusPromiss]);
    return res.status(200).json({
      roles,
      menus,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

// router.post("/createClient", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { user, body } = req;
//     const { id } = user as DynamicUserInterface;

//     const createClientDto = plainToClass(CreateClientDto, body);
//     const errors = await validate(createClientDto);

//     if (errors.length > 0) {
//       const errorMessage = errors.map((error) => ({
//         property: error.property,
//         message: Object.values(error.constraints!),
//       }));
//       return res.status(400).send({
//         errors: errorMessage,
//       });
//     }
//     const { client_name, client_description, countryCode } = createClientDto;

//     const client = new ClientEntity();
//     client.name = client_name;
//     client.description = client_description;
//     client.country = countryCode;
//     client.created_by = id;
//     client.updated_by = id;

//     const clientSaved = await clientRepository.save(client);

//     return res.status(200).json({
//       status: "Success",
//       message: "Client is created successfully",
//       data: clientSaved,
//     });
//   } catch (err) {
//     return res.status(500).send(err);
//   }
// });



export default router;
