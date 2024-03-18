/**
 * DatabaseService provides methods for connecting to the database
 * and handling connection errors.
 *
 * It uses the AppDataSource to initialize the connection.
 * It has an EventEmitter to emit DB_CONNECT_ERROR events when there are errors.
 * It also has a logger to log connection status messages.
 *
 * The main methods are:
 *
 * getConnection - Gets a database connection, handling any errors
 * createConnection - Initializes the AppDataSource connection
 * handleConnectionError - Listens for DB_CONNECT_ERROR and retries connection
 */
import EventEmitter = require("events");
import AppDataSource from "./AppDataSource";
import { Logger } from "@/libs/logger";

class DatabaseService {
  public static emitter: EventEmitter = new EventEmitter();
  public static isConnected = false;
  public static logger: any = new Logger();

  public static async getConnection(callback = null, wait = false) {
    DatabaseService.handleConnectionError();
    return await DatabaseService.createConnection();
  }

  public static async createConnection() {
    return await AppDataSource.initialize()
      .then(() => {
        DatabaseService.isConnected = true;
        DatabaseService.logger.log("info", "database connected successfully");
      })
      .catch((err: Error) => {
        DatabaseService.logger.log("info", "database connection error...retrying");
        console.log(err);
        DatabaseService.logger.log("error", err);
        DatabaseService.emitter.emit("DB_CONNECT_ERROR");
      });
  }
  public static async handleConnectionError() {
    DatabaseService.emitter.on("DB_CONNECT_ERROR", async () => {
      DatabaseService.logger.log("info", "database connection error...retrying");
      setTimeout(async () => {
        await DatabaseService.createConnection();
      }, 3000);
    });
  }
}

export { DatabaseService };
