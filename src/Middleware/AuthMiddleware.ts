import { Request, Response, NextFunction } from "express";
import session from "express-session";
import FileStore from "session-file-store";
import { RequestHandler } from "express";
import { v4 } from "uuid";
import { UserEntity } from "@/Database/entities/UserEntity.entitie";
import { userRepository } from "@/Database/Repository";
import { DynamicUserInterface, getUserDetails } from "@/Database/services/UserService";

const FileStoreSession = FileStore(session);

const SessionMiddleware: RequestHandler = session({
  genid: (req) => {
    if (req.sessionID) {
      return req.sessionID;
    }
    return v4();
  },
  secret: "keyboard cat",
  store: new FileStoreSession(),
  resave: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24 * 7 * 1000,
  },
  saveUninitialized: true,
});

const AuthenticatorChecker = async (req: Request, res: Response, next: NextFunction) => {

  if (!(req as any).isAuthenticated()) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const user = req.user as UserEntity;
  // const userDetails = await userRepository.findOne({ where: { id: user?.id } });
  const userDetails: DynamicUserInterface = (await getUserDetails(user.id)).userDetails || {};

  res.setHeader("x-user", Buffer.from(JSON.stringify(userDetails)).toString("base64"));

  next();
};

export { AuthenticatorChecker, SessionMiddleware };
