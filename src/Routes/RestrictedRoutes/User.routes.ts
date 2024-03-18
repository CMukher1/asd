import { roleRepository, userRepository } from "@/Database/Repository";
import { UserEntity } from "@/Database/entities/UserEntity.entitie";
import express, { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { CreateUserDto } from "@/DTO/UserRouteDTO";
import { validate } from "class-validator";
import { In } from "typeorm";
import { DynamicUserInterface, getUserDetails } from "@/Database/services/UserService";

const router = express.Router();

router.get("/getUserDetails", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user as DynamicUserInterface;

    const data = await getUserDetails(id);

    return res.status(200).json({
      status: "Success",
      data,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.status(500).send({ message: err.message });
    } else {
      console.log('An unexpected error occurred');
      return res
        .status(500)
        .send({ message: 'An unexpected error occurred' });
    }
  }
});

router.post("/insertUser", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const { id } = req.user as DynamicUserInterface;
    const createUserDto = plainToClass(CreateUserDto, body);
    const errors = await validate(createUserDto);

    if (errors.length > 0) {
      const errorMessage = errors.map((error) => ({
        property: error.property,
        message: Object.values(error.constraints!),
      }));
      return res.status(400).send({
        errors: errorMessage,
      });
    }

    const { password, firstname, lastname, email_id,country,langu,contact_no,status } = createUserDto;

    // const client = await clientRepository.findOne({ where: { id: client_id } });


    const newUser = new UserEntity();

   // Set values for the properties
    newUser.password = password;
    newUser.firstname = firstname; 
    newUser.lastname = lastname;
    newUser.email_id = email_id;
    newUser.country = country;
    newUser.contact_no = contact_no;
    newUser.langu = langu;
    newUser.status = status;
    newUser.created_by = id;
    newUser.updated_by = id;
    // newUser.created_by = '123';
    // newUser.updated_by = '123';

    newUser.hashPassword();

    const createdUser = await userRepository.save(newUser);
    
    return res.status(200).json({
      status: "Success",
      message: "User created successfully",
      data: createdUser,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.status(500).send({ message: err.message });
    } else {
      console.log('An unexpected error occurred');
      return res
        .status(500)
        .send({ message: 'An unexpected error occurred' });
    }
  }
});

router.post("/assignRole", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      body: { user_id, role_id },
    } = req;

    const user = await userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      return res.status(400).json({
        status: "Error",
        message: "User not found",
      });
    }

    const roles = await roleRepository.find({ where: { id: In(role_id) } });
    if (roles.length === 0) {
      return res.status(400).json({
        status: "Error",
        message: "Role not found",
      });
    }

    user.roles = roles;
    const updateUser = await userRepository.save(user);

    return res.status(200).json({
      status: "Success",
      message: "Role assigned successfully",
      data: updateUser,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.status(500).send({ message: err.message });
    } else {
      console.log('An unexpected error occurred');
      return res
        .status(500)
        .send({ message: 'An unexpected error occurred' });
    }
  }
});

export default router;
