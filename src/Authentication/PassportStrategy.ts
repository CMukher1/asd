import { Strategy as LocalStrategy, IVerifyOptions } from "passport-local";
import { handleUserValidation } from "./AuthHandler";

export const LocalPassportStrategy = () => {
  return new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    handleUserValidation(email, password, done);
  });
};
