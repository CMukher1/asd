import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import { LocalPassportStrategy } from "./PassportStrategy";
import { DynamicUserInterface, getUserDetails } from "@/Database/services/UserService";
import { UserEntity } from "@/Database/entities/UserEntity.entitie";
import { userRepository } from "@/Database/Repository";
import { Logger } from "@/libs/logger";

const router = express.Router();
const logger = new Logger();

passport.use(LocalPassportStrategy());

passport.serializeUser((user, done) => {
  done(null, (user as any).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const userDetails: DynamicUserInterface = (await getUserDetails(id)).userDetails || {};
    done(null, userDetails || false);
  } catch (err) {
    console.log(err);
    return done(null, { status: 500, message: err });
  }
});

router.post("/Logout", async (req: Request, res: Response, next: NextFunction) => {
  try {
    (req as any).logout(function (err: any) {
      if (err) {
        return next(err);
      }
      res.status(401).send({ status: "error", message: "User logout" });
    });
  } catch (err) {
    logger.log("error", (err as any).stack);
    return res.status(501).send((err as any).stack);
  }
});

router.post("/Login", async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email && !password)
    return res.status(500).send({ message: "email and password are mandatory" });
  doAuthentication(req, res, next);
});

router.post("/SignUp", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email && !password)
      return res.status(500).send({ message: "email and password are mandatory" });

    const user = new UserEntity();
    user.password = password;
    user.email_id = email;
    user.hashPassword();
    await userRepository.save(user);
    doAuthentication(req, res, next);
  } catch (e) {
    console.log(e);
    const errorCode = (e as any).code;
    switch (errorCode) {
      case "ER_DUP_ENTRY":
        return res
          .status(500)
          .send({ message: "Email id is already exist try with another email or try to login." });
      default:
        return res.status(500).send({ message: e });
    }
  }
});

function doAuthentication(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local", (err: Error, user: UserEntity, info: any) => {
    if (info) return res.status(info.status).send(info.message);
    if (err) return next(err);
    if (!user) return res.send("Not logged in redirect to login page");

    req.login(user, async (err) => {
      if (err) return next(err);
      const userDetails = await getUserDetails((user as any).id);
      return res.status(200).json({
        status: "success",
        data: userDetails,
      });
    });
  })(req, res, next);
}

export default router;
