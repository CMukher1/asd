import { Request, Response, NextFunction } from "express";
import path from "path";

/**
 * Middleware to check if files payload exists in the request.
 * @param fileLimit The maximum number of files allowed.
 * @returns Express middleware function.
 */
export const filesPayloadExists = (fileLimit: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const files: any = req.files?.["files"];

    if (!files) return res.status(400).json({ status: "error", message: "Missing files" });

    const filesData = Array.isArray(files) ? files : [files];

    if (filesData.length > fileLimit)
      return res
        .status(400)
        .json({ status: "error", message: `You are sending more than ${fileLimit} files` });
    next();
  };
};

/**
 * Middleware to limit the size of uploaded files.
 * @param size The maximum file size allowed in megabytes.
 * @returns Express middleware function.
 */
export const fileSizeLimiter = (size: number) => {
  const FILE_SIZE_LIMIT = size * 1024 * 1024;

  return (req: Request, res: Response, next: NextFunction) => {
    const files: any = req.files?.["files"];
    const filesData = Array.isArray(files) ? files : [files];

    const filesOverLimit: string[] = [];
    // Which files are over the limit?
    filesData.forEach((file: any) => {
      if (file.size > FILE_SIZE_LIMIT) {
        filesOverLimit.push(file.name);
      }
    });

    if (filesOverLimit.length) {
      const properVerb = filesOverLimit.length > 1 ? "are" : "is";

      const sentence =
        `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${size} MB.`.replaceAll(
          ",",
          ", "
        );

      const message =
        filesOverLimit.length < 3
          ? sentence.replace(",", " and")
          : sentence.replace(/,(?=[^,]*$)/, " and");

      return res.status(413).json({ status: "error", message });
    }

    next();
  };
};

/**
 * Middleware to limit the file extensions of uploaded files.
 * @param allowedExtArray An array of allowed file extensions.
 * @returns Express middleware function.
 */
export const fileExtLimiter = (allowedExtArray: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const files: any = req.files?.["files"];
    const filesData = Array.isArray(files) ? files : [files];

    const fileExtensions: string[] = [];
    filesData.forEach((file: any) => {
      fileExtensions.push(path.extname(file.name));
    });

    // Are the file extensions allowed?
    const allowed = fileExtensions.every((ext) => allowedExtArray.includes(ext));

    if (!allowed) {
      const message = `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(
        ",",
        ", "
      );

      return res.status(422).json({ status: "error", message });
    }

    next();
  };
};
