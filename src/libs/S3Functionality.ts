import { getSignedUrl as getSignedUrlS3 } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import { Readable } from "stream";

// Retrieve necessary environment variables
const { AWS_S3_ACCESS_KEY, AWS_S3_SECRET_KEY, AWS_S3_BUCKET } = process.env;

// Check if any required environment variables are missing
if (!AWS_S3_ACCESS_KEY || !AWS_S3_SECRET_KEY || !AWS_S3_BUCKET) {
  throw new Error("AWS_S3_ACCESS_KEY, AWS_S3_SECRET_KEY, and AWS_S3_BUCKET are required");
}

// Initialize AWS S3 instance with credentials and region
const s3 = new S3({
  credentials: {
    accessKeyId: AWS_S3_ACCESS_KEY,
    secretAccessKey: AWS_S3_SECRET_KEY,
  },

  region: "us-east-1",
});

// Set the bucket name to a constant for easier access
const Bucket = AWS_S3_BUCKET;

/**
 * Uploads a file to an S3 bucket.
 * @param {Buffer} file - The file to upload.
 * @param {string} folder - The folder path within the bucket where the file will be uploaded.
 * @param {string} filename - The name of the file.
 * @returns {Promise<string>} The URL of the uploaded file.
 */
export const uploadFiles = async (
  file: Buffer,
  folder: string,
  filename: string
): Promise<string> => {

  const params = {
    Bucket,
    Key: `${folder}/${filename}`,
    Body: file,
  };

  try {
    const data = await new Upload({
      client: s3,
      params,
    }).done();
    console.log(`File uploaded successfully. Location: ${data.Location}`);
    return data.Key || "";
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

/**
 * Retrieves a list of files from a specific folder in an S3 bucket.
 * @param {string} folder - The folder path within the bucket.
 * @returns {Promise<string[]>} An array of file paths.
 */
export const getListOfFiles = async (folder: string): Promise<string[]> => {

  const params = {
    Bucket,
    Prefix: folder,
  };

  try {
    const data = await s3.listObjectsV2(params);
    if (!data.Contents) return [];

    const fileKeys = data.Contents.map((obj) => obj.Key);
    // Filter out undefined values and assert type
    const filteredFileKeys = fileKeys.filter(
      (key): key is string => typeof key === "string" && key !== folder
    );
    return filteredFileKeys;
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
};

/**
 * Retrieves the contents of a file from an S3 bucket.
 * @param {string} filePath - The path to the file.
 * @returns {Promise<Buffer>} The contents of the file as a Buffer.
 */
export const getFile = async (filePath: string): Promise<Buffer> => {

  const params = {
    Bucket,
    Key: filePath,
  };

  try {
    const data = await s3.getObject(params);
    if (!data.Body) {
      throw new Error("File body not found");
    }
    // Convert stream to Buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of data.Body as Readable) {
      chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
    }
    const fileContent: Buffer = Buffer.concat(chunks);
    return fileContent;
  } catch (error) {
    console.error("Error getting file:", error);
    throw error;
  }
};

/**
 * Deletes multiple files from an S3 bucket.
 * @param {string[]} filePaths - An array of file paths to delete.
 * @returns {Promise<void>}
 */
export const deleteFiles = async (filePaths: string[]): Promise<void> => {

  const objects = filePaths.map((filePath) => ({ Key: filePath }));

  const params = {
    Bucket,
    Delete: {
      Objects: objects,
    },
  };

  try {
    await s3.deleteObjects(params);
    console.log("Files deleted successfully");
  } catch (error) {
    console.error("Error deleting files:", error);
    throw error;
  }
};

/**
 * Generates a presigned URL for accessing a file from an S3 bucket.
 * @param {string} filePath - The path to the file.
 * @returns {Promise<string>} The presigned URL.
 */
export const getSignedURL = async (filePath: string): Promise<string> => {

  const params = {
    Bucket,
    Key: filePath,
  };

  try {
    const signedUrl = await getSignedUrlS3(s3, new GetObjectCommand(params), {
      expiresIn: 7 * 24 * 60 * 60, // Expiry time: 7 days
    });
    console.log("Generated signed URL:", signedUrl);
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};

/**
 * Archives a file by moving it from one location to another within the same S3 bucket.
 * @param {string} sourcePath - The original path of the file.
 * @param {string} destinationPath - The destination path of the file.
 * @returns {Promise<void>}
 */
export const archiveFile = async (sourcePath: string, destinationPath: string): Promise<void> => {

  const copyParams = {
    Bucket,
    CopySource: sourcePath,
    Key: destinationPath,
  };

  const deleteParams = {
    Bucket,
    Key: sourcePath,
  };

  try {
    // Copy the file to the archive location
    await s3.copyObject(copyParams);
    console.log("File archived successfully.");

    // Delete the original file
    await s3.deleteObject(deleteParams);
    console.log("Original file deleted.");
  } catch (error) {
    console.error("Error archiving file:", error);
    throw error;
  }
};
