import { CreateUserDto } from "@/DTO/UserRouteDTO";
import { roleRepository, userRepository } from "@/Database/Repository";
import { UserEntity } from "@/Database/entities/UserEntity.entitie";
// import { initialize } from "@/ModuleFunctionality/AIFunctionality/ResumeBankModule/utils/BatchJob";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import express, { Request, Response, NextFunction } from "express";
import { In } from "typeorm";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // initialize(false);
    return res.status(200).json({
      status: "Success",
      message: "This is a non restricted route",
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err,
    });
  }
});

router.post("/insertUser", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;

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

    const { password, firstname, lastname, email_id } = createUserDto;
    const newUser = new UserEntity();

    // // Set values for the properties
    // newUser.client_id = 1;
    newUser.password = password;
    newUser.firstname = firstname;
    newUser.lastname = lastname;
    newUser.email_id = email_id;
    newUser.created_by = "95875d07-ee1e-41de-beb9-dbeb2614f5e2";
    newUser.updated_by = "95875d07-ee1e-41de-beb9-dbeb2614f5e2";

    newUser.hashPassword();

    const createdUser = await userRepository.save(newUser);

    return res.status(200).json({
      status: "Success",
      message: "User created successfully",
      data: createdUser,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default router;
