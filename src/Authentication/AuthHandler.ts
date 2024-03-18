import { userRepository } from "@/Database/Repository";
import { IVerifyOptions } from "passport-local";
import bcrypt from "bcryptjs";
import { DynamicUserInterface, getUserDetails } from "@/Database/services/UserService";
import { UserEntity } from "@/Database/entities/UserEntity.entitie";

interface CustomVerifyOptions extends IVerifyOptions {
  status?: number;
}

export interface User {
  // other properties of User
  user_id: string;
}

export const handleUserValidation = async (email: string, password: string, done: any) => {
  try {
    const user = await userRepository.findOne({
      where: { email_id: email },
      select: ["id", "email_id", "password"],
    });
    if (!user) {
      const options: CustomVerifyOptions = {
        status: 401,
        message: "There is no user with this email id",
      };
      return done(null, false, options);
    }
    if (user.id === "") {
      const options: CustomVerifyOptions = { status: 401, message: "This user is corrupted" };
      return done(null, false, options);
    }
    const isMatch = user.checkIfUnencryptedPasswordIsValid(password);
    if (!isMatch) {
      const options: CustomVerifyOptions = {
        status: 401,
        message: "You are entering a wrong password",
      };
      return done(null, false, options);
    }

    const userDetails: DynamicUserInterface = (await getUserDetails(user.id)).userDetails || {};
    return done(null, userDetails);
  } catch (err) {
    console.error(err);
    const options: CustomVerifyOptions = { status: 500, message: err as any };
    return done(null, false, options);
  }
};
