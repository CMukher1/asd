import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    /*  
        #swagger.path = '/Example'
    */
  try {
    return res.status(200).json({
      status: "Success",
      message: "This is a restricted route",
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err,
    });
  }
});

export default router;
